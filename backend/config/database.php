<?php
/**
 * PDO MySQL Database Connection & Configuration
 * Production-ready PHP PDO Handler with strict error modes & UTF-8 encoding
 */

declare(strict_types=1);

class Database {
    private string $host;
    private string $db_name;
    private string $username;
    private string $password;
    private string $charset;
    private ?PDO $conn = null;

    public function __construct() {
        $this->host = $_ENV['DB_HOST'] ?? 'localhost';
        $this->db_name = $_ENV['DB_NAME'] ?? 'gbc_blog_cms';
        $this->username = $_ENV['DB_USER'] ?? 'root';
        $this->password = $_ENV['DB_PASS'] ?? '';
        $this->charset = 'utf8mb4';
    }

    public function getConnection(): PDO {
        if ($this->conn !== null) {
            return $this->conn;
        }

        $dsn = "mysql:host={$this->host};dbname={$this->db_name};charset={$this->charset}";
        $options = [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
            PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci"
        ];

        try {
            $this->conn = new PDO($dsn, $this->username, $this->password, $options);
            return $this->conn;
        } catch (PDOException $e) {
            // Safe JSON Error without exposing raw credentials
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => 'Database connection error',
                'error' => [
                    'code' => 'DATABASE_CONNECTION_ERROR',
                    'details' => (isset($_ENV['APP_ENV']) && $_ENV['APP_ENV'] === 'development') ? $e->getMessage() : 'Unable to connect to MySQL database server'
                ]
            ]);
            exit;
        }
    }
}
