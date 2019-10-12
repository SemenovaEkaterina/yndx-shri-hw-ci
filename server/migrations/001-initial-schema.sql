-- Up
CREATE TABLE Build (id INTEGER PRIMARY KEY, hash TEXT, command TEXT, status TEXT, updated INTEGER, agent INTEGER, stdout TEXT, stderr TEXT);
CREATE TABLE Agent (id INTEGER PRIMARY KEY, url TEXT, status TEXT, updated INTEGER);

-- Down
DROP TABLE Build;
DROP TABLE Agent;