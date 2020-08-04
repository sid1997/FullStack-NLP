import time
from flask import Flask,jsonify,request
import os
from nltk.tag import StanfordNERTagger
import pandas as pd

app = Flask(__name__)

@app.route('/desc')

def get_desc():
    os.environ['CLASSPATH'] = "/home/sid/Desktop/stanford-ner-2015-04-20/stanford-ner.jar"
    os.environ['STANFORD_MODELS'] = '/home/sid/Desktop/stanford-corenlp-caseless-2015-04-20-models/edu/stanford/nlp/models/ner'
    stanford_classifier  =  '/home/sid/Desktop/stanford-corenlp-caseless-2015-04-20-models/edu/stanford/nlp/models/ner/english.all.3class.caseless.distsim.crf.ser.gz'
    st = StanfordNERTagger(stanford_classifier)
    str1 = request.args['finalTranscript']
    tagged = st.tag(str(str1).split())
    print(tagged)
    name = ''
    location = ''
    organization = ''
    for i in tagged:
        if i[1]=='PERSON':
            name+=i[0]+' '
        if i[1]=='LOCATION':
            location+=i[0]+' '
        if i[1]=='ORGANIZATION':
            organization+=i[0]+' '

    print(name)
    print(location)
    print(organization)
    return jsonify({'name': name, 'location': location, 'organization': organization})
