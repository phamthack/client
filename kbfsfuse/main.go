// Keybase file system

package main

import (
	"flag"
	"log"

	"github.com/keybase/kbfs/libkbfs"
	"golang.org/x/net/context"
)

var cpuprofile = flag.String("cpuprofile", "", "write cpu profile to file")
var memprofile = flag.String("memprofile", "", "write memory profile to file")
var local = flag.Bool("local", false,
	"use a fake local user DB instead of Keybase")
var localUserFlag = flag.String("localuser", "strib",
	"fake local user (only valid when local=true)")
var clientFlag = flag.Bool("client", false, "use keybase daemon")
var debug = flag.Bool("debug", false, "Print FUSE debug messages")
var newFUSE = flag.Bool("new-fuse", false, "use new FUSE implementation")

func printUsageAndExit() {
	log.Fatal("Usage:\n  kbfsfuse [-client|-local] MOUNTPOINT")
}

func main() {
	flag.Parse()
	if len(flag.Args()) < 1 {
		printUsageAndExit()
	}

	var localUser string
	if *local {
		localUser = *localUserFlag
	} else if *clientFlag {
		localUser = ""
	} else {
		printUsageAndExit()
	}

	config, err := libkbfs.Init(localUser, *cpuprofile, *memprofile)
	if err != nil {
		log.Fatal(err)
	}

	defer libkbfs.Shutdown(*memprofile)

	ctx := context.Background()
	if *newFUSE {
		if err := runNewFUSE(config, *debug, flag.Arg(0)); err != nil {
			log.Fatalf("error serving filesystem: %v", err)
		}
	} else {
		if err := runHanwenFUSE(ctx, config, *debug, flag.Arg(0)); err != nil {
			log.Fatalf("error serving filesystem: %v", err)
		}
	}
}
