package com.ritkart.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private UserDetailsService userDetailsService;

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, 
                                  FilterChain chain) throws ServletException, IOException {
        
        final String requestTokenHeader = request.getHeader("Authorization");
        
        String username = null;
        String jwtToken = null;
        
        // JWT Token is in the form "Bearer token". Remove Bearer word and get only the Token
        if (requestTokenHeader != null && requestTokenHeader.startsWith("Bearer ")) {
            jwtToken = requestTokenHeader.substring(7);
            try {
                username = jwtTokenUtil.getUsernameFromToken(jwtToken);
            } catch (IllegalArgumentException e) {
                logger.error("Unable to get JWT Token", e);
                setErrorResponse(response, "Unable to get JWT Token");
                return;
            } catch (Exception e) {
                logger.error("JWT Token has expired or is invalid", e);
                setErrorResponse(response, "JWT Token has expired or is invalid");
                return;
            }
        } else {
            logger.debug("JWT Token does not begin with Bearer String");
        }

        // Once we get the token validate it.
        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            
            try {
                UserDetails userDetails = this.userDetailsService.loadUserByUsername(username);
                
                // if token is valid configure Spring Security to manually set authentication
                if (jwtTokenUtil.validateToken(jwtToken, userDetails)) {
                    
                    UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken = 
                        new UsernamePasswordAuthenticationToken(
                            userDetails, null, userDetails.getAuthorities());
                    
                    usernamePasswordAuthenticationToken
                        .setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    
                    // After setting the Authentication in the context, we specify
                    // that the current user is authenticated. So it passes the
                    // Spring Security Configurations successfully.
                    SecurityContextHolder.getContext().setAuthentication(usernamePasswordAuthenticationToken);
                }
            } catch (Exception e) {
                logger.error("Error during authentication", e);
                setErrorResponse(response, "Authentication failed");
                return;
            }
        }
        
        chain.doFilter(request, response);
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
        String path = request.getRequestURI();
        
        // Skip JWT filter for these paths
        return path.startsWith("/api/auth/") ||
               path.startsWith("/api/public/") ||
               path.equals("/api/health") ||
               path.startsWith("/swagger-ui/") ||
               path.startsWith("/v3/api-docs") ||
               path.startsWith("/swagger-ui.html") ||
               path.startsWith("/api-docs") ||
               path.startsWith("/actuator/");
    }

    private void setErrorResponse(HttpServletResponse response, String message) throws IOException {
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        
        String jsonResponse = String.format(
            "{\"error\": \"Unauthorized\", \"message\": \"%s\", \"timestamp\": \"%s\"}", 
            message, 
            java.time.LocalDateTime.now().toString()
        );
        
        response.getWriter().write(jsonResponse);
    }
}