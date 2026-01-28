// swift-tools-version: 5.9
import PackageDescription

let package = Package(
    name: "CapgoCapacitorCrisp",
    platforms: [.iOS(.v15)],
    products: [
        .library(
            name: "CapgoCapacitorCrisp",
            targets: ["CapacitorCrispPlugin"])
    ],
    dependencies: [
        .package(url: "https://github.com/ionic-team/capacitor-swift-pm.git", from: "8.0.0"),
        .package(url: "https://github.com/crisp-im/crisp-sdk-ios.git", from: "2.12.0")
    ],
    targets: [
        .target(
            name: "CapacitorCrispPlugin",
            dependencies: [
                .product(name: "Capacitor", package: "capacitor-swift-pm"),
                .product(name: "Cordova", package: "capacitor-swift-pm"),
                .product(name: "Crisp", package: "crisp-sdk-ios")
            ],
            path: "ios/Sources/CapacitorCrispPlugin"),
        .testTarget(
            name: "CapacitorCrispPluginTests",
            dependencies: ["CapacitorCrispPlugin"],
            path: "ios/Tests/CapacitorCrispPluginTests")
    ]
)
