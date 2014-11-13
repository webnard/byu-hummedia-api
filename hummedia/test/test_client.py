import pytest
import json
from .. import config

def test_ic(ASSETS, ACCOUNTS, app):
  app.login(ACCOUNTS["SUPERUSER"])
  response = None

  with open(ASSETS + 'subs.srt') as f:
    data = {"subtitle": (f, 'subs.srt')}
    response = app.post('/video', data=data)

  r_data = json.loads(response.data)
  result = app.get('/annotation?dc:relation=' + r_data['pid'] + '&client=ic')
  print result.content_type
