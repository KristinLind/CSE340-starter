SELECT current_database(), current_user, inet_server_addr();
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public';
SELECT table_schema, table_name
FROM information_schema.tables
ORDER BY table_schema, table_name;
SELECT current_database() AS db, current_user AS user;
SELECT current_database(), current_user;
