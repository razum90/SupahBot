const Helper = require('./index.js');

beforeEach(() => {
  Helper.loadYaml = () => {
    return {}
  }
});

test('that it can fetch keystore value from env', async () => {
  process.env = Object.assign(process.env, {
    MY_VAR_KEYS_API_KEY: 'api-key'
  });

  const keys = await Helper.keys('keys', ['api_key']);
  expect(keys.api_key).toEqual('api-key');
  delete process.env.MY_VAR_API_KEY;
});

test('to fetch non-existing value from env', async () => {
  await Helper.keys('non-existing-key', ['blabla']).catch(err => {
    expect(err).toEqual('non-existing-key not found')
  })
});

test('that it can fetch keystore value from yaml', async () => {
  Helper.loadYaml = () => {
    return {
      keys: {
        secret: 'secret'
      }
    }
  }

  const keys = await Helper.keys('keys', ['secret']);
  expect(keys.secret).toEqual('secret');
});

test('that it can wrap text content', () => {
  expect(Helper.wrap('text')).toEqual('```text```');
});

test('that it can generate a random number', () => {
  const number = Helper.getRandomNumber(1, 10);
  expect(number).toBeGreaterThan(0)
  expect(number).toBeLessThan(11);
});

test('that it can determine if a command is available', () => {
  expect(Helper.commandIsAvailable({})).toEqual(true)
  expect(Helper.commandIsAvailable({
    services: []
  })).toEqual(true)
  expect(Helper.commandIsAvailable({
    services: [
      {
        hasUnmetDepedencies: false
      },
      {
        hasUnmetDepedencies: false
      }
    ]
  })).toEqual(true)
  expect(Helper.commandIsAvailable({
    services: [
      {
        hasUnmetDepedencies: false
      },
      {
        hasUnmetDepedencies: true
      }
    ]
  })).toEqual(false)
  expect(Helper.commandIsAvailable({
    services: [
      {
        hasUnmetDepedencies: true
      }
    ]
  })).toEqual(false)
});

test('that it can return total members of a channel', () => {
  expect(Helper.getTotalMembers({
    members: {
      array: () => [
        {
          user: {
            bot: false
          }
        },
        {
          user: {
            bot: true
          }
        }
      ]
    }
  })).toEqual(1)
});
