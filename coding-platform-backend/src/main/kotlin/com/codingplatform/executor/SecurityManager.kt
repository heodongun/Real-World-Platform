package com.codingplatform.executor

import java.nio.file.InvalidPathException
import java.nio.file.Path

class SecurityManager {
    fun validateFiles(files: Map<String, String>) {
        // [보안] 입력 파일 검증: 제출된 파일의 수, 크기, 경로, 내용을 검증하여 악의적인 입력을 차단합니다.
        // 현재는 경로의 상대 경로 여부만 확인하고 있지만, 다음과 같은 추가 검증을 고려해야 합니다.
        // 1. 파일 수 제한: 너무 많은 파일을 생성하여 시스템 리소스를 고갈시키는 것을 방지합니다.
        // 2. 파일 크기 제한: 비정상적으로 큰 파일을 제출하여 디스크 공간을 고갈시키는 것을 방지합니다.
        // 3. 파일 경로 검증 강화: 허용된 파일 이름 패턴, 확장자를 지정하여 예상치 못한 파일 생성을 막습니다.
        // 4. 파일 내용 검증: 악성 코드나 잠재적으로 위험한 라이브러리 import를 탐지하고 차단합니다.
        files.keys.forEach { path ->
            val normalized = normalize(path)
            require(!normalized.startsWith("..")) { "상대 경로는 허용되지 않습니다: $path" }
        }
    }

    private fun normalize(path: String): String = try {
        Path.of(path).normalize().toString().replace("\\", "/")
    } catch (ex: InvalidPathException) {
        throw IllegalArgumentException("잘못된 파일 경로입니다: $path")
    }
}

