import json

def test_remove_from_collection(app, ACCOUNTS):
  ''' Can the owner of a collection remove a video from the collection? '''
  app.login(ACCOUNTS['SUPERUSER'])
  
  v = app.post('/video')
  data = json.loads(v.data)
  vid_pid = data['pid']

  c = app.post('/collection', data=json.dumps({}), headers={'Content-Type': 'application/json'})
  data = json.loads(c.data)
  col_pid = data['pid']

  # attach video to collection
  membership = [{"collection":{"id":col_pid,"title":"Something"},"videos":[vid_pid]}]
  membership_result = app.post('/batch/video/membership', data=json.dumps(membership), headers={'Content-Type': "application/json"})

  patch_result = app.patch('/collection/' + col_pid, data=json.dumps({'dc:creator': ACCOUNTS['FACULTY']['username']}), headers={'Content-Type': "application/json"})

  app.login(ACCOUNTS['FACULTY'])
  membership = {'ma:isMemberOf': []}
  update_result = app.patch('/video/' + vid_pid, data=json.dumps(membership), headers={'content-type': "application/json"})
  assert update_result.status_code is 200

  result = json.loads(app.get('/collection/' + col_pid).data)
  assert len(result["videos"]) is 0
