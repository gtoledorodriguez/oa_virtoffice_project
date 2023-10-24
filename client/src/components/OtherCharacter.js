import React, { useEffect, useContext } from 'react';
import { connect } from 'react-redux';
import CanvasConext from './CanvasContext';
import { CHARACTER_IMAGE_SIZE, CHARACTER_CLASSES_MAP } from './characterConstants';
import { TILE_SIZE } from './mapConstants';
import { loadCharacter } from './slices/statusSlice';
import { MY_CHARACTER_INIT_CONFIG } from './characterConstants';
import { update as updateAllCharactersData } from './slices/allCharactersSlice';
import { firebaseDatabase } from '../firebase/firebase';
import { ref, set, onValue, remove } from "firebase/database";

const myInitData = {
    name: "name",
    id: "key",
    position: { x: 0, y: 0 },
    characterClass: "characterClass",
};
function OtherCharacter({ otherCharactersData, loadCharacter, key, name, x, y, characterClass }) {
    const context = useContext(CanvasConext);
    useEffect(() => {
        console.log("OtherCharacter: Entered");
        myInitData = {
            name: name,
            id: key,
            position: { x: x, y: y },
            characterClass: characterClass,
        };

        return;

    }, [key, name, x, y, characterClass ]);

    useEffect(() => {
        if (context == null || otherCharactersData == null) {
            return;
        }
        const characterImg = document.querySelector(`#character-sprite-img-${myInitData.characterClass}`);
        const { sx, sy } = CHARACTER_CLASSES_MAP[myInitData.characterClass].icon;
        context.canvas.drawImage(
            characterImg,
            sx,
            sy,
            CHARACTER_IMAGE_SIZE - 5,
            CHARACTER_IMAGE_SIZE - 5,
            otherCharactersData.position.x * TILE_SIZE,
            otherCharactersData.position.y * TILE_SIZE,
            CHARACTER_IMAGE_SIZE,
            CHARACTER_IMAGE_SIZE
        );
        loadCharacter(true);
    }, [context, otherCharactersData?.position.x, otherCharactersData?.position.y, loadCharacter]);

    return null;
}

const mapStateToProps = (state) => {
    // console.log("mapStateToProps: state.allCharacters.users: ", state.allCharacters.users);
    // return { otherCharactersData: state.allCharacters.users[myInitData.id] };
    // const myCharacterData = state.allCharacters.users[MY_CHARACTER_INIT_CONFIG.id];

    const otherCharactersData = Object.keys(state.allCharacters.users)
    .filter(id => id != MY_CHARACTER_INIT_CONFIG.id)
    .reduce((filteredObj, key) => {
        filteredObj[key] = otherCharactersData[key];
        return filteredObj;
    }, []);

    return { otherCharactersData };
};

const mapDispatch = { loadCharacter };

export default connect(mapStateToProps, mapDispatch)(OtherCharacter);