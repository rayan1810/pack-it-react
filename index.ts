import { Clerc, defineCommand } from "clerc";
import inquirer from "inquirer";
import fs from "fs";

async function cloneAndModifyRepository() {
  try {
    // Ask the user for the GitHub repository URL
    const { pckgName } = await inquirer.prompt([
      {
        type: "input",
        name: "pckgName",
        message: "Enter the Package Name:",
      },
    ]);

    // Clone the GitHub repository
    const repoDirectory = pckgName ?? "my-awesome-component-library";
    Bun.spawnSync([
      "git",
      "clone",
      "https://github.com/rayan1810/react-component-library-template.git",
      repoDirectory,
    ]);
    // Read the existing package.json
    const packageJsonPath = `${repoDirectory}/package.json`;
    let packageJsonStr = fs.readFileSync(packageJsonPath, "utf8");
    // Update the package name in package.json
    packageJsonStr = packageJsonStr.replaceAll(
      "Your-Awesome-Component-Library",
      pckgName
    );

    fs.writeFileSync(packageJsonPath, packageJsonStr, "utf8");

    // Read the existing LICENSE
    const LICENSEPath = `${repoDirectory}/LICENSE`;
    let LICENSEStr = fs.readFileSync(LICENSEPath, "utf8");
    // Update the package name in LICENSE
    LICENSEStr = LICENSEStr.replaceAll(
      "Your-Awesome-Component-Library",
      pckgName
    );
    fs.writeFileSync(LICENSEPath, LICENSEStr, "utf8");

    // Write the modified package.json back to the repository
    // fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
    console.log("Package generated successfully.");
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

const goCommand = defineCommand(
  {
    name: "go",
    description:
      "A init command for initializing a react component library starter kit.",
    flags: {},
    parameters: [],
  },
  async (context) => {
    await cloneAndModifyRepository();
  }
);

const cli = Clerc.create()
  .name("React Pack it!") // Optional, defaults to scriptName
  .scriptName("pack-it-react")
  .description("A simple cli to create a react component library boiler plate.")
  .version("1.0.0") // You can use Clerc.create(name, description, version) instead
  .command(goCommand)
  .parse();
