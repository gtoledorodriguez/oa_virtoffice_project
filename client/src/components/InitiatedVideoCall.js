import React, {useEffect, useRef, useCallback, useState} from "react";
import Peer from 'simple-peer';

function InitiatedVideoCall({mySocketId, myStream, othersSocketId, webrtcSocket}) {
    const peerRef = useRef();

    const createPeer = useCallback((othersSocketId, mySocketId, myStream, webrtcSocket) => {
        const peer = new Peer({
            initiator: true,
            trickle: false,
            stream: myStream,
        });
        peer.on('signal', signal => {
            webrtcSocket.emit('sendOffer', {callToUserSocketId: othersSocketId, callFromUserSocketId: mySocketId, offerSignal: signal});
        });
        return peer;
    }, []);
    //Listener
    useEffect(() => {
        peerRef.current = createPeer(othersSocketId, mySocketId, myStream, webrtcSocket);
        webrtcSocket.on("receiveAnswer", payload => {
            console.log("received answer from ", payload.callToUserSocketId, ", answers Received: ", Object.keys(payload.answerSignal));
            if(payload.callToUserSocketId == othersSocketId){
                peerRef.current.signal(payload.answerSignal);
            }
        });
    }, [mySocketId, myStream, othersSocketId, webrtcSocket]);
    return <></>
}

export default InitiatedVideoCall;