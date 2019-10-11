-- Up
CREATE TABLE Build (id INTEGER PRIMARY KEY, command TEXT, status TEXT, updated INTEGER, agent INTEGER);
CREATE TABLE Agent (id INTEGER PRIMARY KEY, url TEXT, status TEXT, updated INTEGER);

-- Down
DROP TABLE Build;
DROP TABLE Agent;