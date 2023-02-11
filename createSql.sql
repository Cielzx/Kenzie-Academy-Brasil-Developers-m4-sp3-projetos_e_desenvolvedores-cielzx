 CREATE DATABASE developer
 
 CREATE TYPE OS AS ENUM('Windows','Linux', 'MacOs');

CREATE TABLE IF NOT EXISTS developer_infos(
	 id SERIAL  PRIMARY KEY, 
	"developerSince" DATE NOT NULL, 
	"preferredOS" OS NOT NULL );


	
	CREATE TABLE IF NOT EXISTS developers(
 	id SERIAL PRIMARY KEY,
	name VARCHAR(50) NOT NULL, 
	email VARCHAR(50) NOT NULL,
	"developerInfoId" INTEGER UNIQUE,
	FOREIGN KEY ("developerInfoId") REFERENCES developer_infos("id") ON DELETE CASCADE);
	
CREATE TABLE IF NOT EXISTS projects(
		"id" SERIAL PRIMARY KEY,
		"name" VARCHAR(50) NOT NULL,
		"description" TEXT NOT NULL,
		"estimatedTime" VARCHAR(20) NOT NULL,
		"repository" VARCHAR(120) NOT NULL,
		"startDate" DATE NOT NULL,
		"endDate" DATE NOT NULL,
		"developerId" INTEGER NOT NULL,
		FOREIGN KEY ("developerId") REFERENCES developers("id") ON DELETE CASCADE
		);
		
	
	 CREATE TABLE IF NOT EXISTS technologies(
 	id SERIAL PRIMARY KEY,
	name VARCHAR(30) NOT NULL
	);

	CREATE TABLE IF NOT EXISTS projects_technologies(
 	id SERIAL PRIMARY KEY,
 	"projectId" INTEGER,
 	FOREIGN KEY ("projectId") REFERENCES projects("id"),
 	"techId" INTEGER,
 	FOREIGN KEY ("techId") REFERENCES technologies("id"),
	addedIn DATE NOT NULL
	);

	INSERT INTO 
	technologies(name)
VALUES
  ('MongoDB');