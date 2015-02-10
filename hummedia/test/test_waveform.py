import json

def test_retrieve_audio_waveform_data(app, ACCOUNTS, ASSETS):
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
