import json

def test_retrieve_mp3_waveform_data(app, ACCOUNTS, ASSETS):
  app.login(ACCOUNTS['SUPERUSER'])
  
  # upload stapler sound
  with open(ASSETS + 'stapler.mp3') as f:
    data = {
        'audio[]': [(f, 'audio.mp3')]
    }
    response = app.post('/batch/audio/ingest', data=data)

  pid = json.loads(response.data)[0]['pid']
  response = app.get('/video/' + pid + '/waveform.json')
  assert response.status_code == 200
  assert response.mimetype == 'text/json'
  assert response.data.replace('\n','') + '\n' == file(ASSETS + 'stapler.mp3.waveformjs.json').read()

def test_retrieve_mp4_waveform(app, ACCOUNTS, ASSETS):
  from uuid import uuid4
  from shutil import copyfile
  from hummedia import config

  filename = 'fire-coin.mp4'
  uid = str(uuid4())

  # upload a video
  app.login(ACCOUNTS['SUPERUSER'])
  response = app.post('/video')
  data = json.loads(response.data)
  pid = data[u'pid']
  copyfile(ASSETS + filename, config.INGEST_DIRECTORY + filename)
  up = json.dumps([{"filepath": filename, "pid": pid, "id":  uid}])
  ingest_response = app.post('/batch/video/ingest', data=up, content_type='application/json')

  # get the waveform
  response = app.get('/video/' + pid + '/waveform.json')
  assert response.status_code == 200
  assert response.mimetype == 'text/json'
  assert response.data.replace('\n','') + '\n' == file(ASSETS + filename + '.waveformjs.json').read()
