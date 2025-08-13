// generateHash.js
const bcrypt = require("bcrypt");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question("Enter the password you want to hash: ", async (password) => {
  if (!password) {
    console.log("❌ Password cannot be empty.");
    rl.close();
    return;
  }

  try {
    const hash = await bcrypt.hash(password, 10);
    console.log("\n✅ Your bcrypt hash is:\n");
    console.log(hash);
    console.log("\n👉 Copy this hash into your .env file as ADMIN_PASSWORD.");
  } catch (err) {
    console.error("❌ Error generating hash:", err);
  }

  rl.close();
});
