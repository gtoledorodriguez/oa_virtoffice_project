import React, {useEffect, useContext} from 'react';
import {connect} from 'react-redux';
import CanvasConext from './CanvasContext';
import {CHARACTER_IMAGE_SIZE, CHARACTER_CLASSES_MAP} from './characterConstants';
import {TILE_SIZE} from './mapConstants';
import {loadCharacter} from './slices/statusSlice';
import { MY_CHARACTER_INIT_CONFIG } from './characterConstants';
import {update as updateAllCharactersData} from './slices/allCharactersSlice';
import { firebaseDatabase } from '../firebase/firebase';
import { ref, set, onValue, remove } from "firebase/database";


function MyCharacter({ myCharactersData, loadCharacter, updateAllCharactersData, webrtcSocket }) {
    console.log("MY Character: ", MY_CHARACTER_INIT_CONFIG.id, " Position: ", MY_CHARACTER_INIT_CONFIG.position.x, ", ", MY_CHARACTER_INIT_CONFIG.position.y );
    const context = useContext(CanvasConext);
    useEffect(() => {
        const myInitData = {
            ...MY_CHARACTER_INIT_CONFIG,
            socketId: webrtcSocket.id,
        };
        set(ref(firebaseDatabase, 'users/' + MY_CHARACTER_INIT_CONFIG.id), myInitData);
        return () => {
            var myCharacterRef = ref(firebaseDatabase, 'users/' + MY_CHARACTER_INIT_CONFIG.id);
            remove(myCharacterRef)
                .then(function(){
                    console.log("MyCharacter remove succeeded.");
                })
                .catch(function(error){
                    console.log("MyCharacter remove failed: " + error.message);
                });
        }
    }, [webrtcSocket]);

    useEffect(() => {
        if (context == null || myCharactersData == null) {
            return;
        }
        const characterImg = document.querySelector(`#character-sprite-img-${MY_CHARACTER_INIT_CONFIG.characterClass}`);
        const { sx, sy } = CHARACTER_CLASSES_MAP[MY_CHARACTER_INIT_CONFIG.characterClass].icon;
        context.canvas.drawImage(
            characterImg,
            sx,
            sy,
            CHARACTER_IMAGE_SIZE - 5,
            CHARACTER_IMAGE_SIZE - 5,
            myCharactersData.position.x * TILE_SIZE,
            myCharactersData.position.y * TILE_SIZE,
            CHARACTER_IMAGE_SIZE,
            CHARACTER_IMAGE_SIZE
        );
        loadCharacter(true);
    }, [context, myCharactersData?.position.x, myCharactersData?.position.y, loadCharacter]);

    return null;
}

const mapStateToProps = (state) => {
    // console.log("mapStateToProps: state.allCharacters.users: ", state.allCharacters.users);
    return {myCharactersData: state.allCharacters.users[MY_CHARACTER_INIT_CONFIG.id]};
};

const mapDispatch = {loadCharacter};

export default connect(mapStateToProps, mapDispatch)(MyCharacter);