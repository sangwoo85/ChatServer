const { execSync } = require("child_process");

const packages = ["@stomp/stompjs", "sockjs-client"]; // 필요한 패키지 리스트

packages.forEach((pkg) => {
  try {
    require.resolve(pkg); // 패키지가 설치되어 있는지 확인
    console.log(`✅ ${pkg} is already installed.`);
  } catch (e) {
    console.log(`📦 ${pkg} not found. Installing...`);
    execSync(`npm install ${pkg}`, { stdio: "inherit" }); // 패키지 설치
  }
});