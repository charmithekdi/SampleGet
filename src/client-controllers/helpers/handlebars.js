/* eslint-disable eqeqeq */
/* eslint-disable arrow-body-style */
/* eslint-disable consistent-return */
/* eslint-disable no-param-reassign */
const moment = require('moment');
const Handlebar = require('handlebars')
const replaceSpaceArray = function (str) {
  return str.replace(/\s+/g, '');
};
const replaceSpaceArrayfollow = function (str) {
  return str.trim();
};
const register = (Handlebars) => {
  const helpers = {
    inc(value, options) {
      return parseInt(value, 10) + 1;
    },
    dec(value, len) {
      return len - parseInt(value, 10);
    },
    checkIfNullOrUndefined(value, options) {
      return (value === null || value === '' || value === undefined || value == 0)
      ? options.fn(this) : options.inverse(this);
    },
   substr(length,context,options){
      if(context.length > length){
        return context.substring(0,length) + "...";
      }else{
        return context;
      }
    },
    turnery(isTacticPageLoad,entityArr,entityId,p1, p2) {
      if(isTacticPageLoad) {
        return p1;
      }
      if(entityArr && entityArr.indexOf(entityId) != -1) {
        return p1;
      }
      return p2;
    },
    setDefault(str, flag, str1) {
      if(flag) {
        //console.log("+++++++++", str, str1);
        // let str1 = data.soa ? (data.soa['0'] ? data.soa['0'].soa_provider_name : null) : null;
        return str ? str : (!str1 ? 'NA' : str1);
      } else {
        return (str === null || str === '' || str === undefined) ? 'NA' : str;
      }
    },
    getJsonValue(json) {
      if(!json) {
        return '0';
      }
      var keys = Object.keys(json);
      if(json.measure_type && Array.isArray(json.measure_type) && json.planned) {
          if(json.measure_type[0] == "unique opens") {
            return (+json.planned[json.measure_type[0]]);
          } else {
            return (+json.planned[json.measure_type[1]]);
          }
      } else {
         let tp = 0, cateMatch = false;
          for(let k =0; k < keys.length; k++) {
              if(!isNaN(json[keys[k]]) && keys[k].indexOf('opens') != -1) {
                  tp = +json[keys[k]];
                  cateMatch = true;
              }
          }
          if(!tp && !cateMatch) {
            for (let k = 0; k < keys.length; k++) {
                if (!isNaN(json[keys[k]])) {
                    tp = +json[keys[k]];
                }
            }
          }
          return tp;
      }
    },
    twoDecimal(val)
    {
      var n = val || 0;
      n=parseFloat(n).toFixed(2);
      //return  parseFloat(n).toLocaleString('en-US', {maximumFractionDigits:2});
      return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    },
    calculate_opex_total(Arr,keyName)
    {    
      var sum = 0;

      if (Array.isArray(Arr)) {

        Arr.forEach(element => {
         // sum += options.fn(item);
         if(element[keyName]){
          sum += parseFloat(element[keyName]);
         }
          
        });
      }
      var n=parseFloat(sum).toFixed(2);
      //return  parseFloat(n).toLocaleString('en-US', {maximumFractionDigits:2});
      return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
      //return parseFloat(sum).toFixed(2);
    },
    truncateString(str, start, end) {
      str = str.replace(/\n/g, ' ');
      str = str.replace(/\s\s+/g, ' ');
      let theString = str.substring( start, 50 );
      theString = str.length > 50 ? `${theString} ...` : theString;
      return new Handlebar.SafeString(theString);
    },
    displayAdoptionLadder(str) {
      // console.log(str, 'Ladder String', str.split(','));
      let t = str.split(',');
      t = t.map((e) => {
        return e.toLowerCase() === 'aware' ? 'No User' : e;
      });
      return t.join(', ');
    },
    dateFormat(str, format) {
      // console.log(str, 'date');
      return str ? moment(str.split('T')[0]).format(format) : 'NA';
    },

    currentYear() {
      var d = new Date();
      var year = d.getFullYear();
      return year;
    },
    
    setVar(varName, varValue, options) {
      options.data.root[varName] = varValue;
    },
    setMonthList(options) {
      var  months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
      options.data.root['months_list'] = months;
    },
    setQuarterList(options) {
      var  quarter = ["Q1", "Q2", "Q3", "Q4"];
      options.data.root['quarter_list'] = quarter;
    },
    concat(varName,str1,str2,str3, options) {
      //  console.log('concat=',str1+str2+str3);
       options.data.root[varName] = str1+str2+str3;
    },
    json(obj) {
      // console.log("obj=",obj);
      return JSON.stringify(obj);
    },
    toJson(obj, requiredUnique) {
      // console.log("obj=", obj);
      try{
        if(requiredUnique == "provider") {
          let arr = JSON.parse(obj);
          // console.log(arr);
          let filteredArr = [
            ...new Map(arr.map(p => [`${p.provider}`, p]))
            .values()
          ];
          return filteredArr;
        }
        return JSON.parse(obj);
      }
      catch(error){
        let dummyObj = `[{"document_number":"${obj}","name":"","country_code":"","status":"","video_id":"${obj}"}]`
        return JSON.parse(dummyObj); 
      }  
    },
    sum(var1, var2) {
      return var1+var2;
    },
    ifCond(v1, operator, v2, options) {
      // console.log('ifcond', v1, v2);
      switch (operator) {
      case '==': {
        if (typeof v1 == 'string' && typeof v2 == 'string') {
          return (v1.toUpperCase() == v2.toUpperCase()) ? options.fn(this) : options.inverse(this);

        } else {
          return (v1 == v2) ? options.fn(this) : options.inverse(this);

        }
      }        
      case '===':
        return (v1 === v2) ? options.fn(this) : options.inverse(this);
      case '!=':
        return (v1 != v2) ? options.fn(this) : options.inverse(this);
      case '!==':
        return (v1 !== v2) ? options.fn(this) : options.inverse(this);
      case '<':
        return (v1 < v2) ? options.fn(this) : options.inverse(this);
      case '<=':
        return (v1 <= v2) ? options.fn(this) : options.inverse(this);
      case '>':
        return (v1 > v2) ? options.fn(this) : options.inverse(this);
      case '>=':
        return (v1 >= v2) ? options.fn(this) : options.inverse(this);
      case '&&':
        return (v1 && v2) ? options.fn(this) : options.inverse(this);
      case '||':
        return (v1 || v2) ? options.fn(this) : options.inverse(this);
      default:
        return options.inverse(this);
      }
    },

    ifCondTactic(v1, operator, v2, options) {
      let a = parseInt(v1);
      let b = parseInt(v2);
      switch (operator) {
        case '<=':
        return (a <= b) ? options.fn(this) : options.inverse(this);
        default:
        return options.inverse(this);
      }
    },
    isNotEmpty(arr, options) {
      if (arr && Array.isArray(arr)) {
        return arr.filter(ele => ele).length > 0 ? options.fn(this) : options.inverse(this);
      }
      // console.log(arr, Array.isArray(arr), 'empty Arr');
      return options.inverse(this);
    },
    getTaskID(data){
      // console.log("data",data);
      return this.data.record["ID"];
    },

    rawHelper(options){
      return options.fn();
    }
  };

  if (Handlebars && typeof Handlebars.registerHelper === 'function') {
    for (const prop in helpers) {
      Handlebars.registerHelper(prop, helpers[prop]);
    }
  } else {
    return helpers;
  }
};

module.exports.register = register;
module.exports.helpers = register(null);
