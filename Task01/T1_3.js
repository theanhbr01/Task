function IsSumUp($arr, $sum){
    for(let i = 0; i < $arr.length; ++i){
        if($arr.find(e => e = $sum - $arr[i])){
            return true;
        }
    }
    return false;
}