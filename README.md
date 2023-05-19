# GradleFileSorter

Sorts all Gradle files in an Android app according to an arbitrary and non-customizable process.

## Running 
Run via the command line : `node main.js "/absolute/path/to/project"`. 

For example `node main.js "/Users/joe/Code/NowInAndroid/nowinandroid"`

It has only been tested on a few projects ([NowInAndroid](https://github.com/android/nowinandroid), [Tivi](https://github.com/chrisbanes/tivi)) so it probably doesn't work for all projects  :)

Also, only supports .kts files ATM.

## NowInAndroid example

Input:

```kotlin
dependencies {
    implementation(project(":feature:interests"))
    implementation(project(":feature:foryou"))
    implementation(project(":feature:bookmarks"))
    implementation(project(":feature:topic"))
    implementation(project(":feature:search"))
    implementation(project(":feature:settings"))

    implementation(project(":core:common"))
    implementation(project(":core:ui"))
    implementation(project(":core:designsystem"))
    implementation(project(":core:data"))
    implementation(project(":core:model"))
    implementation(project(":core:analytics"))

    implementation(project(":sync:work"))

    androidTestImplementation(project(":core:testing"))
    androidTestImplementation(project(":core:datastore-test"))
    androidTestImplementation(project(":core:data-test"))
    androidTestImplementation(project(":core:network"))
    androidTestImplementation(libs.androidx.navigation.testing)
    androidTestImplementation(libs.accompanist.testharness)
    androidTestImplementation(kotlin("test"))
    debugImplementation(libs.androidx.compose.ui.testManifest)
    debugImplementation(project(":ui-test-hilt-manifest"))

    implementation(libs.accompanist.systemuicontroller)
    implementation(libs.androidx.activity.compose)
    implementation(libs.androidx.appcompat)
    implementation(libs.androidx.core.ktx)
    implementation(libs.androidx.core.splashscreen)
    implementation(libs.androidx.compose.runtime)
    implementation(libs.androidx.lifecycle.runtimeCompose)
    implementation(libs.androidx.compose.runtime.tracing)
    implementation(libs.androidx.compose.material3.windowSizeClass)
    implementation(libs.androidx.hilt.navigation.compose)
    implementation(libs.androidx.navigation.compose)
    implementation(libs.androidx.window.manager)
    implementation(libs.androidx.profileinstaller)
    implementation(libs.coil.kt)
}
```

Output: 

```kotlin
dependencies {
    implementation(project(":core:analytics"))
    implementation(project(":core:common"))
    implementation(project(":core:data"))
    implementation(project(":core:designsystem"))
    implementation(project(":core:model"))
    implementation(project(":core:ui"))
    implementation(project(":feature:bookmarks"))
    implementation(project(":feature:foryou"))
    implementation(project(":feature:interests"))
    implementation(project(":feature:search"))
    implementation(project(":feature:settings"))
    implementation(project(":feature:topic"))
    implementation(project(":sync:work"))

    implementation(libs.accompanist.systemuicontroller)
    implementation(libs.androidx.activity.compose)
    implementation(libs.androidx.appcompat)
    implementation(libs.androidx.compose.material3.windowSizeClass)
    implementation(libs.androidx.compose.runtime.tracing)
    implementation(libs.androidx.compose.runtime)
    implementation(libs.androidx.core.ktx)
    implementation(libs.androidx.core.splashscreen)
    implementation(libs.androidx.hilt.navigation.compose)
    implementation(libs.androidx.lifecycle.runtimeCompose)
    implementation(libs.androidx.navigation.compose)
    implementation(libs.androidx.profileinstaller)
    implementation(libs.androidx.window.manager)
    implementation(libs.coil.kt)

    debugImplementation(project(":ui-test-hilt-manifest"))

    debugImplementation(libs.androidx.compose.ui.testManifest)

    androidTestImplementation(project(":core:data-test"))
    androidTestImplementation(project(":core:datastore-test"))
    androidTestImplementation(project(":core:network"))
    androidTestImplementation(project(":core:testing"))

    androidTestImplementation(kotlin("test"))

    androidTestImplementation(libs.accompanist.testharness)
    androidTestImplementation(libs.androidx.navigation.testing)
}
```

## Tivi example

Input:

```kotlin
dependencies {
    implementation(projects.core.base)
    implementation(projects.core.analytics)
    implementation(projects.core.logging)
    implementation(projects.core.performance)
    implementation(projects.core.powercontroller)
    implementation(projects.core.preferences)
    implementation(projects.common.ui.view)
    implementation(projects.common.imageloading)
    implementation(projects.common.ui.compose)
    implementation(projects.data.dbSqldelight)
    implementation(projects.api.trakt)
    implementation(projects.api.tmdb)
    implementation(projects.domain)
    implementation(projects.tasks.android)

    implementation(projects.ui.account)
    implementation(projects.ui.discover)
    implementation(projects.ui.episode.details)
    implementation(projects.ui.episode.track)
    implementation(projects.ui.library)
    implementation(projects.ui.popular)
    implementation(projects.ui.trending)
    implementation(projects.ui.recommended)
    implementation(projects.ui.search)
    implementation(projects.ui.show.details)
    implementation(projects.ui.show.seasons)
    implementation(projects.ui.settings)
    implementation(projects.ui.upnext)

    implementation(libs.androidx.lifecycle.viewmodel.ktx)

    implementation(libs.androidx.activity.activity)
    implementation(libs.androidx.activity.compose)

    implementation(libs.androidx.navigation.compose)

    implementation(libs.androidx.emoji)

    implementation(libs.compose.foundation.foundation)
    implementation(libs.compose.foundation.layout)
    implementation(libs.compose.material.material)
    implementation(libs.compose.material.iconsext)
    implementation(libs.compose.material3)
    implementation(libs.compose.animation.animation)
    implementation(libs.compose.ui.tooling)

    lintChecks(libs.slack.lint.compose)

    implementation(libs.accompanist.navigation.animation)
    implementation(libs.accompanist.navigation.material)

    implementation(libs.timber)

    implementation(libs.kotlin.coroutines.android)

    implementation(libs.androidx.profileinstaller)

    implementation(libs.okhttp.loggingInterceptor)

    ksp(libs.kotlininject.compiler)

    implementation(libs.google.firebase.crashlytics)

    qaImplementation(libs.chucker.library)

    qaImplementation(libs.debugdrawer.debugdrawer)
    qaImplementation(libs.debugdrawer.timber)
    qaImplementation(libs.debugdrawer.okhttplogger)

    qaImplementation(libs.leakCanary)

    testImplementation(libs.junit)
    testImplementation(libs.robolectric)
    testImplementation(libs.androidx.test.core)
    testImplementation(libs.androidx.test.rules)
}
```

Output:

```kotlin
dependencies {
    implementation(projects.api.tmdb)
    implementation(projects.api.trakt)
    implementation(projects.common.imageloading)
    implementation(projects.common.ui.compose)
    implementation(projects.common.ui.view)
    implementation(projects.core.analytics)
    implementation(projects.core.base)
    implementation(projects.core.logging)
    implementation(projects.core.performance)
    implementation(projects.core.powercontroller)
    implementation(projects.core.preferences)
    implementation(projects.data.dbSqldelight)
    implementation(projects.domain)
    implementation(projects.tasks.android)
    implementation(projects.ui.account)
    implementation(projects.ui.discover)
    implementation(projects.ui.episode.details)
    implementation(projects.ui.episode.track)
    implementation(projects.ui.library)
    implementation(projects.ui.popular)
    implementation(projects.ui.recommended)
    implementation(projects.ui.search)
    implementation(projects.ui.settings)
    implementation(projects.ui.show.details)
    implementation(projects.ui.show.seasons)
    implementation(projects.ui.trending)
    implementation(projects.ui.upnext)

    implementation(libs.accompanist.navigation.animation)
    implementation(libs.accompanist.navigation.material)
    implementation(libs.androidx.activity.activity)
    implementation(libs.androidx.activity.compose)
    implementation(libs.androidx.emoji)
    implementation(libs.androidx.lifecycle.viewmodel.ktx)
    implementation(libs.androidx.navigation.compose)
    implementation(libs.androidx.profileinstaller)
    implementation(libs.compose.animation.animation)
    implementation(libs.compose.foundation.foundation)
    implementation(libs.compose.foundation.layout)
    implementation(libs.compose.material.iconsext)
    implementation(libs.compose.material.material)
    implementation(libs.compose.material3)
    implementation(libs.compose.ui.tooling)
    implementation(libs.google.firebase.crashlytics)
    implementation(libs.kotlin.coroutines.android)
    implementation(libs.okhttp.loggingInterceptor)
    implementation(libs.timber)

    ksp(libs.kotlininject.compiler)

    lintChecks(libs.slack.lint.compose)

    qaImplementation(libs.chucker.library)
    qaImplementation(libs.debugdrawer.debugdrawer)
    qaImplementation(libs.debugdrawer.okhttplogger)
    qaImplementation(libs.debugdrawer.timber)
    qaImplementation(libs.leakCanary)

    testImplementation(libs.androidx.test.core)
    testImplementation(libs.androidx.test.rules)
    testImplementation(libs.junit)
    testImplementation(libs.robolectric)
}
```