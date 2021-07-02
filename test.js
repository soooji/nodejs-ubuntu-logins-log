const { exec } = require("child_process");

exec("cat /etc/shadow", (error, stdout, stderr) => {
    if (error) {
        console.log(`error: ${error.message}`);
        return;
    }
    if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
    }
   //  console.log(`stdout: ${stdout}`);
    const resu = stdout;
    const resArr = resu.split('\n');
    for(item of resArr) {
       if(item.startsWith('d')) {
         console.log(item);
       } 
    }
});