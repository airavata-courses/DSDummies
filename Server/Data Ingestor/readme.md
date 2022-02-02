# How to run

1. conda env create -f environment.yml (setting up virtual env)
2. conda activate new-test-env (activating env)
3. pip install -r requirements.txt
4. conda run -n new-test-env python3 main.py (starting flask server)

The app will run on : http://127.0.0.1:5678

Run this URL to test : http://127.0.0.1:5678/isworking
