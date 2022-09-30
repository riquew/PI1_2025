CREATE DATABASE BLOG;

USE BLOG;

CREATE TABLE POST (
	id int NOT NULL AUTO_INCREMENT,
	titulo varchar(200) NOT NULL,
    conteudo varchar(5000) NOT NULL,
    imagem varchar(5000),
    PRIMARY KEY(id)
);