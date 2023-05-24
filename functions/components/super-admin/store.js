import SuperAdminModel from '../../models/super-admin.js'; // Assuming you have a countDocuments function in your superAdminModel

export function createSuperAdmin (data) {
    return new Promise((resolve, reject) => {
        SuperAdminModel.create(data)
        .then((newDoc) => {
            resolve(newDoc)
        })
        .catch(err => {
            reject(err)
        })
    })
}

export function newSuperAdmin(data) {
    return new Promise(async (resolve, reject) => {
        try {
            // Check if there are already 2 super admin accounts
            const superAdminCount = await SuperAdminModel.countDocuments({});

            if (superAdminCount >= 2) {
                reject(new Error('There are already 2 super admin accounts.'));
                return;
            }

            // Create account on Firebase
            const userRecord = await adminAuth.createUser({
                email: data.email,
                emailVerified: false,
                password: data.password,
                displayName: data.name + " " + data.lname,
                photoURL: data.image,
                disabled: false,
            });

            console.log('Successfully created new user on firebase:', userRecord.uid);

            // Set custom claims for super admin role
            await adminAuth.setCustomUserClaims(userRecord.uid, { role: "superAdmin" });

            // Generate ObjectId for super admin document
            const id = new ObjectId();

            // Create super admin document
            const superAdminData = {
                _id: id,
                uid: userRecord.uid,
                email: data.email,
                name: data.name,
                lname: data.lname,
                phone: data.phone,
                image: data.image,
                businessName: data.businessName,
                socialInsurance: data.socialInsurance,
                bankAccount: data.bankAccount,
                address: data.address,
            };

            const superAdmin = await createSuperAdmin(superAdminData);
            resolve(superAdmin);
        } catch (error) {
            console.log('Error creating new super admin:', error);
            reject(error);
        }
    });
}
