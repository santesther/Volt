package com.personal.fitanalyzer.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Base64;
import java.util.Date;


@Service
public class JwtService {

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration}")
    private Long expiration;

    public String generateToken(UserDetails userDetails) {
        return Jwts.builder()
                .subject(userDetails.getUsername())
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(generateKey())
                .compact();
    }

    public String extractUsername(String jwtToken) {
        Claims claims = getClaims(jwtToken);
        return claims.getSubject();
    }

    private Claims getClaims(String jwtToken) {
        return Jwts.parser()
                .verifyWith(generateKey())
                .build()
                .parseSignedClaims(jwtToken)
                .getPayload();
    }

    public boolean isTokenValid(String jwtToken, UserDetails userDetails) {
        Claims claims = getClaims(jwtToken);
        boolean isExpired = claims.getExpiration().before(new Date());
        boolean emailMatches = claims.getSubject().equals(userDetails.getUsername());
        return !isExpired && emailMatches;
    }

    private SecretKey generateKey(){
        byte[] decodedKey = Base64.getDecoder().decode(secret);
        return Keys.hmacShaKeyFor(decodedKey);
    }
}

