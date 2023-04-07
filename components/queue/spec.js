const waitForExpect = require('wait-for-expect')
const Queue = require('./index.js');

beforeAll(() => {
  process.env = Object.assign(process.env, {
    MY_VAR_QUEUE_MAXLEN: 2,
    MY_VAR_QUEUE_SKIPMAJORITY: 0.5,
    MY_VAR_ADMIN_IDS: '123, 456'
  });
});

test('to instantiate the Queue', async () => {
  let queue = new Queue()
  await waitForExpect(() => {
    expect(queue.maxlen).toEqual(2)
  })
  expect(queue.skipVotes).toEqual([])
  expect(queue.queue).toEqual([])
  expect(queue.currentDispatcher).toBeFalsy()
  expect(queue.admins).toEqual(['123', '456'])
  expect(queue.skipmajority).toEqual(0.5)
});

test('to add tracks to the queue', async () => {
  let queue = new Queue()
  queue.play = jest.fn()
  let message = {
    reply: jest.fn()
  }
  await waitForExpect(() => {
    expect(queue.maxlen).toEqual(2)
  })
  queue.add({
    title: 'Some cool title'
  }, message)
  queue.add({
    title: 'Some cool title 2'
  }, message)
  expect(queue.queue).toEqual([{ title: 'Some cool title' }, { title: 'Some cool title 2' }])
  expect(queue.play).toHaveBeenCalledTimes(1)
})

test('to check if the queue is full', async () => {
  let queue = new Queue()
  await waitForExpect(() => {
    expect(queue.maxlen).toEqual(2)
  })
  queue.play = jest.fn()
  let message = {
    reply: jest.fn()
  }
  queue.add({
    title: 'Some cool title'
  }, message)
  expect(queue.isFull()).toBeFalsy()
  queue.add({
    title: 'Some cool title 2'
  }, message)
  expect(queue.isFull()).toBeTruthy()
})

test('to show the currently playing song', async () => {
  let queue = new Queue()
  await waitForExpect(() => {
    expect(queue.maxlen).toEqual(2)
  })
  queue.play = jest.fn()
  let message = {
    reply: jest.fn()
  }
  queue.add({
    title: 'Some cool title',
    url: 'cool url'
  }, message)
  queue.showSong(message)
  expect(message.reply.mock.calls[0]).toEqual(['```Added Some cool title to the queue. (number 1)```'])
  expect(message.reply.mock.calls[1]).toEqual(['```Now playing: Some cool title\ncool url```'])
})

test('to vote-skip a song as admin', async () => {
  let queue = new Queue()
  let endFn = jest.fn()
  let replyFn = jest.fn()
  queue.currentDispatcher = {
    end: endFn
  }
  await waitForExpect(() => {
    expect(queue.maxlen).toEqual(2)
  })
  let message = {
    reply: replyFn,
    guild: {
      channels: {
        filter: () => {
          return {
            filter: () => {
              return {
                members: {
                  some: () => true
                },
                join: () => {
                  then: () => {}
                },
                array: () => [{}]
              }
            }
          }
        }
      }
    },
    author: {
      id: '123'
    },
    member: {
      user: {
        id: '123'
      }
    }
  }
  queue.voteSkip(message)
  expect(endFn).toHaveBeenCalled()
  expect(replyFn).toHaveBeenCalledWith('```Of course sir.```')
})

test('to vote-skip a song with not enough majority', async () => {
  let queue = new Queue()
  let replyFn = jest.fn()
  queue.currentDispatcher = {}
  await waitForExpect(() => {
    expect(queue.maxlen).toEqual(2)
  })
  let message = {
    reply: replyFn,
    guild: {
      channels: {
        filter: () => {
          return {
            filter: () => {
              return {
                members: {
                  some: () => true
                },
                join: () => {
                  then: () => {}
                },
                array: () => [{
                  members: {
                    array: () => [
                      {
                        user: {
                          bot: false
                        }
                      },
                      {
                        user: {
                          bot: false
                        }
                      },
                      {
                        user: {
                          bot: false
                        }
                      }
                    ]
                  }
                }]
              }
            }
          }
        }
      }
    },
    author: {
      id: 'non-admin-id'
    },
    member: {
      user: {
        id: 'non-admin-id'
      }
    }
  }
  queue.voteSkip(message)
  expect(replyFn).toHaveBeenCalledWith('```You need 1 more vote(s) to skip this song.```')
})

test('to vote-skip a song', async () => {
  let queue = new Queue()
  let replyFn = jest.fn()
  let endFn = jest.fn()
  queue.currentDispatcher = {
    end: endFn
  }
  await waitForExpect(() => {
    expect(queue.maxlen).toEqual(2)
  })
  let message = {
    reply: replyFn,
    guild: {
      channels: {
        filter: () => {
          return {
            filter: () => {
              return {
                members: {
                  some: () => true
                },
                join: () => {
                  then: () => {}
                },
                array: () => [{
                  members: {
                    array: () => [{
                        user: {
                          bot: false
                        }
                      },
                      {
                        user: {
                          bot: false
                        }
                      }
                    ]
                  }
                }]
              }
            }
          }
        }
      }
    },
    author: {
      id: 'non-admin-id'
    },
    member: {
      user: {
        id: 'non-admin-id'
      }
    }
  }
  queue.voteSkip(message)
  expect(endFn).toHaveBeenCalled()
})
