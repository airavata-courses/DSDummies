#!/bin/bash
cd Client
make build

echo "going out now"
cd ..
cd Auth
make build

echo "going out now"
cd ..
cd Data\ Ingestor/
make build


cd ..
cd cache
make build

cd ..
make run-dev
