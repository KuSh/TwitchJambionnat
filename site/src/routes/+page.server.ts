import { GOOGLE_APPLICATION_CREDENTIALS } from '$env/static/private';
import { BatteRoyalVictoryType, type BatteRoyalVictory } from '$lib/types';
import { Firestore } from '@google-cloud/firestore';
import { DateTime } from 'luxon';

export const load = async () => {
	const victories = new Firestore({ keyFilename: GOOGLE_APPLICATION_CREDENTIALS })
		.collection('events')
		.where('type', '==', BatteRoyalVictoryType)
		.where('timestamp', '>=', DateTime.local().startOf('month').toJSDate())
		.get()
		.then(({ docs }) =>
			docs.map((doc) => {
				const { timestamp, ...rest } = doc.data();
				return { timestamp: timestamp.toMillis(), ...rest } as BatteRoyalVictory;
			})
		);

	return { victories };
};
