<?php

date_default_timezone_set('America/Los_Angeles');

try {
  $DB = new PDO("mysql:dbname=words;host=localhost;port=3306", 'username', 'password');
  $DB->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $err) {
  die("Connection failed, the reason: {$err->getMessage()}");
}

// Posting new name or getting table?
if (isset($_POST["name"]) && isset($_POST["score"])) {
  $q = $DB->prepare('INSERT INTO scores (name, score, date) VALUES (:name, :score, NOW())');
  $q->bindValue(':name', $_POST["name"], PDO::PARAM_STR);
  $q->bindValue(':score', $_POST["score"], PDO::PARAM_INT);
  if(!$q->execute()) {
    throw new Exception("An error occurred when submitting score, sorry.");
  }
}

$query = $DB->prepare('SELECT name, score FROM scores ORDER BY score DESC LIMIT 10');
if(!$query->execute()) {
  throw new Exception("Problem querying database");
}
$response = json_encode($query->fetchAll(PDO::FETCH_ASSOC));

$DB = null;
header('Content-type: application/json');

echo $response;






?>