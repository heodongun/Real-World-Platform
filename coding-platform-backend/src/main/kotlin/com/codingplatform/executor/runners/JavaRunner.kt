package com.codingplatform.executor.runners

import com.codingplatform.executor.LanguageRunner
import com.codingplatform.models.Language

class JavaRunner : LanguageRunner {
    override val language: Language = Language.JAVA

    override fun getBuildCommand(): List<String> =
        listOf("sh", "-c", "chmod +x gradlew && ./gradlew build --no-daemon")

    override fun getTestCommand(): List<String> =
        listOf("sh", "-c", "chmod +x gradlew && ./gradlew test --no-daemon")

    override fun getRunCommand(mainClass: String): List<String> =
        // [보안] 명령어 인젝션 위험: 사용자 입력을 쉘 명령어에 직접 삽입하면 명령어 인젝션 공격에 취약해질 수 있습니다.
        // 예를 들어, mainClass 값에 `'; rm -rf /` 와 같은 악의적인 문자열이 포함될 경우 심각한 문제가 발생할 수 있습니다.
        // 사용자 입력을 쉘에 전달하기 전에 반드시 안전하게 이스케이프하거나, 쉘을 사용하지 않고 직접 프로세스를 실행하는 방법을 고려해야 합니다.
        listOf("sh", "-c", "chmod +x gradlew && ./gradlew run --args='$mainClass'")
}

