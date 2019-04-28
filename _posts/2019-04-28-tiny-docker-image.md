---
layout: blog
title: Building a Tiny Docker Image
excerpt: Tomorrow, I will do a session at a high school for computer science. They asked me to speak about Docker container and related technologies like Kubernetes. In the session, I want to highlight that containers are not just VMs. So I decided to build a tiny, tiny Docker image using assembler language.
author: Rainer Stropek
date: 2019-04-28
bannerimage: /content/images/blog/2019/microscope.jpg
lang: en
tags: [Docker, Container, Assembler]
permalink: /devblog/2019/04/tiny-docker-image
showtoc: true
---

{: .banner-image}
![Intro Logo]({{site.baseurl}}/content/images/blog/2019/microscope.jpg)

## Introduction

Tomorrow, I will do a session at a high school for computer science. They asked me to speak about Docker container and related technologies like Kubernetes. In the session, I want to highlight that containers are not just VMs. So I decided to build a tiny, tiny Docker image using assembler language.

## Image with NASM

We will use the [Netwide Assembler *NASM*](https://www.nasm.us/) to build the executable for our tiny container. Let's build an [Alpine](https://alpinelinux.org/)-based image and install NASM in it. Here is a *Dockerfile* for that:

```Dockerfile
FROM i386/debian
LABEL author="Rainer Stropek @rstropek"

# Install packages necessary for installing NASM
RUN apt-get update \
  && apt-get install -y \
       asciidoc \
       build-essential \
       curl \
       xmlto

# Default version of NASM that we want to install
ARG NASMVERSION=2.14.02

# Download and install NASM
RUN curl --output nasm-${NASMVERSION}.tar.gz -L https://www.nasm.us/pub/nasm/releasebuilds/${NASMVERSION}/nasm-${NASMVERSION}.tar.gz \
  && tar -xzf nasm-${NASMVERSION}.tar.gz --directory /usr/local/src \
  && cd /usr/local/src/nasm-${NASMVERSION}/ \
  && ./configure \
  && make \
  && make install

# Run shell if container is started
CMD ["/bin/bash"]
```

Build the Docker image with `docker build -t rstropek/nasm-gcc .` (replace *rstropek* with your Docker Hub user).

## Assembler *Hello World*

Next, let's write an assembler program with some Linux Kernel calls. I call it *hello.asm*.

```asm
        BITS 32
        SECTION .data       ; DATA
msg:    db "Hello World",10 ; This is the text we want to print.
                            ; The 10 at the end means "next line" (see
                            ; http://www.asciitable.com/)
len:    equ $-msg           ; We calculate the length of the text by
                            ; subtracting the memory address of msg
                            ; from the current address ("$")

        SECTION .text       ; PROGRAM CODE
        global _start       ; Program starts at _start
_start:
                            ; We use the Linux syscall "write"
                            ; (see http://man7.org/linux/man-pages/man2/write.2.html)
        mov edx, len        ; edx receives the length of the string
                            ; edx is a so called "register" (Details see
                            ; https://en.wikipedia.org/wiki/Processor_register)
        mov ecx, msg        ; ecx receives the address of the text
        mov ebx, 1          ; 1 means "stdout" = screen
        mov eax, 4          ; 4 identifies the syscall "write"
        int 0x80            ; Call Linux kernel with interrupt 0x80

                            ; To exit, we use the syscall "exit"
                            ; (see http://man7.org/linux/man-pages/man2/exit.2.html)
        mov ebx, 0          ; 0 means "no error"
        mov eax, 1          ; 1 identifies the syscall "exit"
        int 0x80
```

## Generate Tiny Image

Now we can use our previously created image *rstropek/nasm-gcc* with NASM to generate our tiny image in a multi-staged build process:

```Dockerfile
# Use a multi-stage build
FROM rstropek/nasm-gcc AS build

# Arguments for gcc:
# - Compile for 32bit
# - Link statically
# - Optimize for size
# - No standard system startup file (we have our own _start)
# - No unwind tables (to make our executable even smaller)
ARG GCCARGS="-m32 -static -Os -nostartfiles -fno-asynchronous-unwind-tables"

WORKDIR /src
COPY hello.asm /src

# Compile and link our assembler code
RUN nasm -f elf hello.asm \
  && gcc ${GCCARGS} -o hello hello.o \
  && strip -R .comment -s hello

FROM scratch
COPY --from=build /src/hello /
CMD ["/hello"]
```

Build the Docker image with `docker build -t rstropek/hello-world .` (replace *rstropek* with your Docker Hub user).

## Let's Check the Size

```txt
rainer@dockervm:~/containerdata/nasm$ docker images rstropek/hello-world
REPOSITORY             TAG                 IMAGE ID            CREATED             SIZE
rstropek/hello-world   latest              53fc14858574        8 minutes ago       484B
```

484 Bytes, nice. Does it work?

```txt
rainer@dockervm:~/containerdata/nasm$ docker run rstropek/hello-world
Hello World
```

Yes it does :-)
