#!/bin/sh
docker run e2semenova/yandex-shri-hw-ci-runner:0.1.0 /bin/sh -c "git clone $1 . && git reset $2 && $3"