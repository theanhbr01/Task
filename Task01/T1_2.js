function CompressString($string){
    let count = 1;
    $string += '#';
    let compressedString = "";
    for(let i = 0; i < $string.length - 1; ++i){
        if($string[i] !== $string[i + 1]){
            if(count > 1) {
                compressedString += count;
                count = 0;
            }
            compressedString += $string[i];
        }
        count++;
    }
    return compressedString;
}