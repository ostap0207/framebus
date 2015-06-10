'use strict';

describe('_broadcast', function () {
  it('should postMessage to current frame', function () {
    var frame = mkFrame(this);
    this.bus._broadcast(frame, 'payload', '*');

    expect(frame.postMessage).to.have.been.called;
  });

  it("should postMessage to current frame's child frames", function () {
    var frame = mkFrame(this);
    frame.frames.push(mkFrame(this));

    this.bus._broadcast(frame, 'payload', '*');

    expect(frame.frames[0].postMessage).to.have.been.called;
  });

  it('should postMessage to window.opener if it exists', function () {
    var frame = mkFrame(this);
    frame.opener = {};
    frame.opener.top = {
      postMessage: this.sandbox.spy(),
      frames: []
    };

    this.bus._broadcast(frame, 'payload', '*');

    expect(frame.opener.top.postMessage).to.have.been.called;
  });

  it("should postMessage to the window.opener's child frames", function () {
    var frame = mkFrame(this);

    frame.opener = {};
    frame.opener.top = {
      postMessage: this.sandbox.spy(),
      frames: [mkFrame(this)]
    };

    this.bus._broadcast(frame, 'payload', '*');

    expect(frame.opener.top.frames[0].postMessage).to.have.been.called;
  });
});
