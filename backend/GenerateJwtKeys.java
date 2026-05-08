import java.security.KeyPairGenerator;
import java.security.KeyPair;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.Base64;

public class GenerateJwtKeys {
    public static void main(String[] args) throws Exception {
        KeyPairGenerator kpg = KeyPairGenerator.getInstance("RSA");
        kpg.initialize(2048);
        KeyPair kp = kpg.generateKeyPair();

        String privKeyB64 = Base64.getEncoder().encodeToString(kp.getPrivate().getEncoded());
        String pubKeyB64 = Base64.getEncoder().encodeToString(kp.getPublic().getEncoded());

        StringBuilder privPem = new StringBuilder("-----BEGIN RSA PRIVATE KEY-----\n");
        for(int i = 0; i < privKeyB64.length(); i += 64) {
            int end = Math.min(i + 64, privKeyB64.length());
            privPem.append(privKeyB64, i, end).append("\n");
        }
        privPem.append("-----END RSA PRIVATE KEY-----");

        StringBuilder pubPem = new StringBuilder("-----BEGIN PUBLIC KEY-----\n");
        for(int i = 0; i < pubKeyB64.length(); i += 64) {
            int end = Math.min(i + 64, pubKeyB64.length());
            pubPem.append(pubKeyB64, i, end).append("\n");
        }
        pubPem.append("-----END PUBLIC KEY-----");

        Files.write(Paths.get("src/main/resources/META-INF/private-key.pem"), privPem.toString().getBytes());
        Files.write(Paths.get("src/main/resources/META-INF/public-key.pem"), pubPem.toString().getBytes());

        System.out.println("JWT keys generated successfully!");
        System.out.println("- src/main/resources/META-INF/private-key.pem");
        System.out.println("- src/main/resources/META-INF/public-key.pem");
    }
}

