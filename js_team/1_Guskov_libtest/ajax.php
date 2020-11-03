<?php 

$input = json_decode(file_get_contents("php://input"), true);
$db = json_decode(file_get_contents("5ecre7_db.txt"), true);
$stat = json_decode(file_get_contents("5ecre7_stats.txt"), true);

$visitor = $input['visitor'];
$input = $input['components'];

if ($db == null) {
	$db=array();
};
if ($stat == null) {
	$stat=array();
};
$response = array();

if ($input != null) {
	if ($visitor == 'new') {
		// add new entry to db
		array_push($db, $input);
		
		// update statistics db
		foreach($input as $attrname => $attr) {
			
			$value = stringifyInput($attr['value']);
			$stat[$attrname][$value]['amount'] ++;
		}
		// recalculate percents in statistics
		foreach($stat as $attrname => $attr) {
			$sum = 0;
			foreach ($attr as $entry) {
				$sum += $entry['amount'];
			}
			foreach ($attr as $value => $entry)
				$stat[$attrname][$value]['percents'] = $entry['amount']/$sum;
		}
		
		// save DBs
		file_put_contents("5ecre7_db.txt", json_encode($db));
		file_put_contents("5ecre7_stats.txt", json_encode($stat));
	}
	// fill response with percents data
	foreach($input as $attrname => $attr) {
		$value = stringifyInput($attr['value']);
		$response[$attrname] = $stat[$attrname][$value]['percents'];
	}
}
else {
	$response['error'] = 'Empty string';
}

// send response
echo json_encode($response);

function stringifyInput($input) {
	switch(gettype($input)) {
		case "boolean":
		case "integer":
		case "double":
		case "string":	$value = strval($input); break;
		case "array":	$value = json_encode($input); break;
		case "NULL": 	$value = "undefined"; break;
		default: 		$value = NULL; break;
	}
	return $value;
}

?>