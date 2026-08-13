import ROLES from "../constants/roles.js";


const buildRoleFilter = (role)=> {
    if(role !== ROLES.ADMIN){
        return{};
    }

    return{
        isActive: true,
    };
};

export default buildRoleFilter;