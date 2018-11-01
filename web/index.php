<?php
header('Content-type: application/json');
$date         = @date('Ymd');
$tmpPath      = !empty($_POST['tmp_path']) ? $_POST['tmp_path'] : $date . '/' . uniqid(); //todo 目录判断
$uploadTmpDir = __DIR__ . '/../upload_tmp/' . $tmpPath . '/';

$uploadDir     = '/upload/' . $date . '/';
$uploadFullDir = __DIR__ . '/..' . $uploadDir;

if (!is_dir($uploadTmpDir)) {
    if (!mkdir($uploadTmpDir, 0775, true)) {
        echo json_encode([
            'status' => 'fail',
            'msg'    => 'mkdir fail'
        ]);
        exit;
    }
}

if (!is_dir($uploadFullDir)) {
    if (!mkdir($uploadFullDir, 0775, true)) {
        echo json_encode([
            'status' => 'fail',
            'msg'    => 'mkdir fail'
        ]);
        exit;
    }
}

$file      = $_FILES['file'];
$page      = $_POST['page'];
$totalPage = $_POST['total_page'];
$fileName  = preg_replace('/\s+/', '', $_POST['file_name']);
$suffix    = strrchr($fileName, '.');

$suffix = substr($suffix, 1);
move_uploaded_file($file['tmp_name'], $uploadTmpDir . $page);
$newFileName = uniqid() . '.' . $suffix;
if ($page == $totalPage) {

    $content = '';
    for ($i = 1; $i <= $totalPage; $i++) {
        $content .= file_get_contents($uploadTmpDir . $i);
        unlink($uploadTmpDir . $i);
    }
    file_put_contents($uploadFullDir . $newFileName, $content);
    echo json_encode([
        'status' => 'success',
        'data'   => [
            'path'       => $uploadDir,
            'video_name' => $newFileName
        ]
    ]);
    exit;
}
echo json_encode([
    'status' => 'success',
    'data'   => ['tmp_path' => $tmpPath],
]);
exit;