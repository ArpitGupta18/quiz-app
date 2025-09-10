const bcrypt = require("bcrypt");

(async () => {
	const plain = "Admin@123";
	const hash = "$2b$10$J3Vq2gS4N1k8kq8H3mV6xO3JbJf6x0m5q3j9j9DkQvQm9M6C4zQiq"; // hash in DB

	const ok = await bcrypt.compare(plain, hash);
	console.log("Result:", ok);
})();
