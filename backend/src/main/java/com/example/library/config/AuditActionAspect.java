package com.example.library.config;

import com.example.library.annotations.AuditAction;
import com.example.library.util.FileAuditLogger;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.stereotype.Component;

@Aspect
@Component
public class AuditActionAspect {

    private final FileAuditLogger fileAuditLogger;

    public AuditActionAspect(FileAuditLogger fileAuditLogger) {
        this.fileAuditLogger = fileAuditLogger;
    }

    @Around("@annotation(auditAction)")
    public Object aroundAuditedMethod(ProceedingJoinPoint pjp, AuditAction auditAction) throws Throwable {
        Object result = pjp.proceed();
        String action = auditAction.value();
        String details = pjp.getSignature().toShortString();
        fileAuditLogger.log(action, details);
        return result;
    }
}

