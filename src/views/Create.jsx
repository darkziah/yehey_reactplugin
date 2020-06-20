import React, { useState, useEffect } from 'react';

import _ from "lodash";

import { IonTextarea, IonModal, IonItem, IonInput, IonButtons, IonBackButton, IonHeader, IonToolbar, IonTitle, IonIcon, IonButton, IonText, IonContent, IonSearchbar, IonPage, IonRow, IonCol, IonCard, IonSpinner, IonCardHeader, IonBadge, IonThumbnail, IonCardTitle, IonCardContent, IonCardSubtitle, IonLabel } from '@ionic/react';

import { phonePortrait, linkOutline } from 'ionicons/icons';

import {
    Modal, Button
} from "reactstrap";

import "./Create.css"

function Create() {
    const [jpAddress, setJpAddress] = useState()
    const [engAddress, setEngAddress] = useState()
    const [postalCode, setPostalCode] = useState()

    const getAddress = address => {
        const space = new RegExp(" ", "g");
        const fixadd = address.town.replace(/ *\([^)]*\) */g, "").replace(/,/g, "").replace(space, "");
        const fixaddj = address.town_kanji
            .replace(/ *\（[^)]*\） */g, "")
            .replace(/,/g, "");

        setEngAddress(`${address.prefecture} ${address.city} ${fixadd}`)
        setJpAddress(`${address.prefecture_kanji} ${address.city_kanji} ${fixaddj}`)
        setPostalCode(zeroFill(address.postal_code, 7))
    }

    function zeroFill(number, width) {
        width -= number.toString().length;
        if (width > 0) {
            return new Array(width + (/\./.test(number) ? 2 : 1)).join('0') + number;
        }
        return number + ""; // always return a string
    }

    return (

        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonBackButton defaultHref="plugin" />
                    </IonButtons>
                    
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <IonCard>
                    <IonCardHeader>
                        <IonCardTitle>Create New Client</IonCardTitle>
                        <IonCardSubtitle>
                        </IonCardSubtitle>
                    </IonCardHeader>
                    <IonCardContent>
                        <IonItem mode="ios">
                            <IonLabel position="floating">Name</IonLabel>
                            <IonInput type="name"></IonInput>
                        </IonItem>

                        <IonItem mode="ios">
                            <IonLabel position="floating">Phone</IonLabel>
                            <IonInput type="phone"></IonInput>
                        </IonItem>

                        <IonRow>
                            <IonCol size={2}></IonCol>


                            <AddressSearch getAddress={getAddress} postal={postalCode} />





                            <IonCol size={2}></IonCol>
                        </IonRow>

                        <IonRow>

                            <IonCol>
                                <IonItem>
                                    <IonLabel position="stacked">English Address</IonLabel>
                                    <IonTextarea

                                        value={engAddress} onIonChange={e => setEngAddress(e.detail.value)}>
                                    </IonTextarea>
                                </IonItem>
                            </IonCol>
                            <IonCol>
                                <IonItem>
                                    <IonLabel position="stacked">Japanese Address</IonLabel>
                                    <IonTextarea
                                        value={jpAddress} onIonChange={e => setJpAddress(e.detail.value)}>
                                    </IonTextarea>
                                </IonItem>
                            </IonCol>

                        </IonRow>


                    </IonCardContent>
                </IonCard>
            </IonContent>

        </IonPage>
    );
};


const AddressSearch = (props) => {
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [floading, setfLoading] = useState(false);
    const [addresses, setAddresses] = useState();

    const searchAdd = async (value) => {
        setfLoading(true)
        setLoading(true)
        const response = await fetch(
            `https://ap-southeast-2.aws.webhooks.mongodb-stitch.com/api/client/v2.0/app/reactplugin-uxowx/service/AddressAPI/incoming_webhook/frontAddress?search=${value}*`,
            {
                method: "GET",
            }
        );
        const json = await response.json();
        setLoading(false)
        setAddresses(Array.from(json))
    }

    function zeroFill(number, width) {
        width -= number.toString().length;
        if (width > 0) {
            return new Array(width + (/\./.test(number) ? 2 : 1)).join('0') + number;
        }
        return number + ""; // always return a string
    }

    return (
        <>
            <Modal
                className="modal-dialog-centered"
                isOpen={showModal}
                toggle={() => setShowModal(false)}
            >
                <div className="modal-header">
                    <IonSearchbar search-icon="" inputmode="name" mode="ios" placeholder="Address Search" animated onIonChange={e => searchAdd(e.detail.value)} ></IonSearchbar>
                </div>
                {floading ?
                    <div className="modal-body">
                        {loading ? <Loading /> : null}
                        {(addresses || []).map((address, index) => {
                            if (address.town === "*") return
                            return (
                                <IonCard onClick={() => {
                                    props.getAddress(address)
                                    setShowModal(false)
                                }}>
                                    <IonCardHeader>
                                        <IonCardSubtitle>
                                            {zeroFill(address.postal_code, 7)}
                                        </IonCardSubtitle>
                                    </IonCardHeader>
                                    <IonCardContent>
                                        <IonText>{`${address.prefecture} ${address.city} ${address.town}`}</IonText>

                                    </IonCardContent>
                                </IonCard>

                            )
                        })}


                    </div> : <></>}

            </Modal>
            <IonCol onClick={() => setShowModal(true)}>
                <IonItem mode="ios">
                    <IonLabel className="center" position="floating" >Postal Code</IonLabel>
                    <IonInput value={props.postal}></IonInput>
                </IonItem>
            </IonCol>
        </>
    )
}

const Loading = () => {
    return (
        <IonRow>
            <IonCol>
                <IonSpinner name="crescent" />
            </IonCol>
        </IonRow>
    );
};

export default Create