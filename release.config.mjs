export default {
  branches: [
    {
      name: "v6",
      prerelease: "alpha",
    },
    "main",
  ],
  plugins: [
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator",
    [
      "@semantic-release/changelog",
      {
        changelogFile: "packages/core/CHANGELOG.md",
      },
    ],
    [
      "@semantic-release/npm",
      {
        pkgRoot: "packages/core",
        npmPublish: false,
      },
    ],
    [
      "@semantic-release/git",
      {
        assets: ["packages/core/package.json", "packages/core/CHANGELOG.md"],
      },
    ],
  ],
  ci: false,
  dryRun: false,
};
