
import { config } from "dotenv";
import postgres from "postgres";

config({ path: ".env.local" });

async function testConnection() {
  const connectionString = process.env.POSTGRES_URL;
  if (!connectionString) {
    console.error("❌ POSTGRES_URL is not defined");
    process.exit(1);
  }

  console.log(`🔌 Testing connection to: ${connectionString.replace(/:[^:@]*@/, ":****@")}`); 

  try {
    const sql = postgres(connectionString, { ssl: 'require' });
    const result = await sql`SELECT now()`;
    console.log("✅ Database connection successful!");
    console.log("Timestamp:", result[0].now);
    await sql.end();
    process.exit(0);
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    process.exit(1);
  }
}

testConnection();
