<?php
/**
 * Audit Logger Helper
 * Tracks sensitive admin actions (e.g. post deletion, gold rate updates, settings changes)
 */

declare(strict_types=1);

class LoggerHelper {
    /**
     * Record an audit log entry in MySQL audit_logs table and fallback log file
     */
    public static function logAudit(
        ?PDO $db,
        ?int $userId,
        string $action,
        string $entityType,
        ?int $entityId = null,
        array|object|null $payload = null
    ): bool {
        $ipAddress = $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1';
        $payloadJson = !empty($payload) ? json_encode($payload, JSON_UNESCAPED_SLASHES) : null;

        // 1. Try MySQL Database insert
        if ($db !== null) {
            try {
                $sql = "INSERT INTO audit_logs (user_id, action, entity_type, entity_id, payload_json, ip_address, created_at) 
                        VALUES (:user_id, :action, :entity_type, :entity_id, :payload_json, :ip_address, NOW())";
                $stmt = $db->prepare($sql);
                $stmt->execute([
                    ':user_id' => $userId,
                    ':action' => $action,
                    ':entity_type' => $entityType,
                    ':entity_id' => $entityId,
                    ':payload_json' => $payloadJson,
                    ':ip_address' => $ipAddress
                ]);
            } catch (Exception $e) {
                // Fallback to file logging if DB write fails
            }
        }

        // 2. Local log file backup
        try {
            $logDir = __DIR__ . '/../logs';
            if (!is_dir($logDir)) {
                @mkdir($logDir, 0755, true);
            }
            $logFile = $logDir . '/audit.log';
            $logLine = sprintf(
                "[%s] IP:%s | USER:%s | ACTION:%s | TYPE:%s | ID:%s | PAYLOAD:%s\n",
                date('Y-m-d H:i:s'),
                $ipAddress,
                $userId ?? 'GUEST',
                $action,
                $entityType,
                $entityId ?? 'N/A',
                $payloadJson ?? '{}'
            );
            @file_put_contents($logFile, $logLine, FILE_APPEND | LOCK_EX);
        } catch (Exception $e) {
            // ignore
        }

        return true;
    }
}
