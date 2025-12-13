/**
 * FlagGame - Jeu de quiz sur les drapeaux
 * Tous les drapeaux sont affichés, le joueur doit deviner le nom de chaque pays
 */
class FlagGame extends GameBase {
    constructor() {
        super('flags', 'Challenge Drapeaux', 'Devinez tous les drapeaux des pays de l\'ONU !');
        
        // Liste complète des 193 pays membres de l'ONU
        this.countries = this.getAllUNCountries();

        // État du jeu
        this.foundCountries = []; // Codes des pays déjà trouvés
        this.userAnswers = {}; // { countryCode: userInput }
        this.hintsRevealed = {}; // { countryCode: [indices de lettres révélées] }
        this.countriesOrder = []; // Ordre aléatoire des pays
    }

    /**
     * Retourne la liste complète des pays de l'ONU
     * @returns {Array} Liste des pays avec code, nom et URL du drapeau
     */
    getAllUNCountries() {
        // Liste des 193 pays membres de l'ONU
        // Format: { code: 'XX', name: 'Nom du pays', flag: 'URL', altNames: ['variantes'] }
        return [
            { code: 'AF', name: 'Afghanistan', flag: 'https://flagcdn.com/w160/af.png', altNames: [] },
            { code: 'ZA', name: 'Afrique du Sud', flag: 'https://flagcdn.com/w160/za.png', altNames: ['Afrique du sud', 'South Africa'] },
            { code: 'AL', name: 'Albanie', flag: 'https://flagcdn.com/w160/al.png', altNames: [] },
            { code: 'DZ', name: 'Algérie', flag: 'https://flagcdn.com/w160/dz.png', altNames: ['Algerie'] },
            { code: 'DE', name: 'Allemagne', flag: 'https://flagcdn.com/w160/de.png', altNames: ['Germany'] },
            { code: 'AD', name: 'Andorre', flag: 'https://flagcdn.com/w160/ad.png', altNames: [] },
            { code: 'AO', name: 'Angola', flag: 'https://flagcdn.com/w160/ao.png', altNames: [] },
            { code: 'AG', name: 'Antigua-et-Barbuda', flag: 'https://flagcdn.com/w160/ag.png', altNames: ['Antigua et Barbuda'] },
            { code: 'SA', name: 'Arabie saoudite', flag: 'https://flagcdn.com/w160/sa.png', altNames: ['Arabie Saoudite', 'Saudi Arabia'] },
            { code: 'AR', name: 'Argentine', flag: 'https://flagcdn.com/w160/ar.png', altNames: ['Argentina'] },
            { code: 'AM', name: 'Arménie', flag: 'https://flagcdn.com/w160/am.png', altNames: ['Armenie'] },
            { code: 'AU', name: 'Australie', flag: 'https://flagcdn.com/w160/au.png', altNames: ['Australia'] },
            { code: 'AT', name: 'Autriche', flag: 'https://flagcdn.com/w160/at.png', altNames: ['Austria'] },
            { code: 'AZ', name: 'Azerbaïdjan', flag: 'https://flagcdn.com/w160/az.png', altNames: ['Azerbaidjan'] },
            { code: 'BS', name: 'Bahamas', flag: 'https://flagcdn.com/w160/bs.png', altNames: [] },
            { code: 'BD', name: 'Bangladesh', flag: 'https://flagcdn.com/w160/bd.png', altNames: [] },
            { code: 'BB', name: 'Barbade', flag: 'https://flagcdn.com/w160/bb.png', altNames: [] },
            { code: 'BH', name: 'Bahreïn', flag: 'https://flagcdn.com/w160/bh.png', altNames: ['Bahrein'] },
            { code: 'BE', name: 'Belgique', flag: 'https://flagcdn.com/w160/be.png', altNames: ['Belgium'] },
            { code: 'BZ', name: 'Belize', flag: 'https://flagcdn.com/w160/bz.png', altNames: [] },
            { code: 'BJ', name: 'Bénin', flag: 'https://flagcdn.com/w160/bj.png', altNames: ['Benin'] },
            { code: 'BT', name: 'Bhoutan', flag: 'https://flagcdn.com/w160/bt.png', altNames: [] },
            { code: 'BY', name: 'Biélorussie', flag: 'https://flagcdn.com/w160/by.png', altNames: ['Bielorussie', 'Belarus'] },
            { code: 'MM', name: 'Birmanie', flag: 'https://flagcdn.com/w160/mm.png', altNames: ['Myanmar'] },
            { code: 'BO', name: 'Bolivie', flag: 'https://flagcdn.com/w160/bo.png', altNames: ['Bolivia'] },
            { code: 'BA', name: 'Bosnie-Herzégovine', flag: 'https://flagcdn.com/w160/ba.png', altNames: ['Bosnie Herzégovine', 'Bosnia'] },
            { code: 'BW', name: 'Botswana', flag: 'https://flagcdn.com/w160/bw.png', altNames: [] },
            { code: 'BR', name: 'Brésil', flag: 'https://flagcdn.com/w160/br.png', altNames: ['Bresil', 'Brazil'] },
            { code: 'BN', name: 'Brunei', flag: 'https://flagcdn.com/w160/bn.png', altNames: [] },
            { code: 'BG', name: 'Bulgarie', flag: 'https://flagcdn.com/w160/bg.png', altNames: ['Bulgaria'] },
            { code: 'BF', name: 'Burkina Faso', flag: 'https://flagcdn.com/w160/bf.png', altNames: [] },
            { code: 'BI', name: 'Burundi', flag: 'https://flagcdn.com/w160/bi.png', altNames: [] },
            { code: 'KH', name: 'Cambodge', flag: 'https://flagcdn.com/w160/kh.png', altNames: ['Cambodia'] },
            { code: 'CM', name: 'Cameroun', flag: 'https://flagcdn.com/w160/cm.png', altNames: ['Cameroon'] },
            { code: 'CA', name: 'Canada', flag: 'https://flagcdn.com/w160/ca.png', altNames: [] },
            { code: 'CV', name: 'Cap-Vert', flag: 'https://flagcdn.com/w160/cv.png', altNames: ['Cap Vert', 'Cape Verde'] },
            { code: 'CF', name: 'République centrafricaine', flag: 'https://flagcdn.com/w160/cf.png', altNames: ['Centrafrique', 'Central African Republic'] },
            { code: 'TD', name: 'Tchad', flag: 'https://flagcdn.com/w160/td.png', altNames: ['Chad'] },
            { code: 'CL', name: 'Chili', flag: 'https://flagcdn.com/w160/cl.png', altNames: ['Chile'] },
            { code: 'CN', name: 'Chine', flag: 'https://flagcdn.com/w160/cn.png', altNames: ['China'] },
            { code: 'CY', name: 'Chypre', flag: 'https://flagcdn.com/w160/cy.png', altNames: ['Cyprus'] },
            { code: 'CO', name: 'Colombie', flag: 'https://flagcdn.com/w160/co.png', altNames: ['Colombia'] },
            { code: 'KM', name: 'Comores', flag: 'https://flagcdn.com/w160/km.png', altNames: [] },
            { code: 'CG', name: 'Congo', flag: 'https://flagcdn.com/w160/cg.png', altNames: ['Republic of the Congo'] },
            { code: 'CD', name: 'République démocratique du Congo', flag: 'https://flagcdn.com/w160/cd.png', altNames: ['RDC', 'RD Congo', 'Democratic Republic of the Congo'] },
            { code: 'KR', name: 'Corée du Sud', flag: 'https://flagcdn.com/w160/kr.png', altNames: ['Coree du Sud', 'South Korea'] },
            { code: 'KP', name: 'Corée du Nord', flag: 'https://flagcdn.com/w160/kp.png', altNames: ['Coree du Nord', 'North Korea'] },
            { code: 'CR', name: 'Costa Rica', flag: 'https://flagcdn.com/w160/cr.png', altNames: [] },
            { code: 'CI', name: 'Côte d\'Ivoire', flag: 'https://flagcdn.com/w160/ci.png', altNames: ['Cote d\'Ivoire', 'Ivory Coast'] },
            { code: 'HR', name: 'Croatie', flag: 'https://flagcdn.com/w160/hr.png', altNames: ['Croatia'] },
            { code: 'CU', name: 'Cuba', flag: 'https://flagcdn.com/w160/cu.png', altNames: [] },
            { code: 'DK', name: 'Danemark', flag: 'https://flagcdn.com/w160/dk.png', altNames: ['Denmark'] },
            { code: 'DJ', name: 'Djibouti', flag: 'https://flagcdn.com/w160/dj.png', altNames: [] },
            { code: 'DM', name: 'Dominique', flag: 'https://flagcdn.com/w160/dm.png', altNames: ['Dominica'] },
            { code: 'EG', name: 'Égypte', flag: 'https://flagcdn.com/w160/eg.png', altNames: ['Egypte', 'Egypt'] },
            { code: 'AE', name: 'Émirats arabes unis', flag: 'https://flagcdn.com/w160/ae.png', altNames: ['Emirats arabes unis', 'UAE'] },
            { code: 'EC', name: 'Équateur', flag: 'https://flagcdn.com/w160/ec.png', altNames: ['Equateur', 'Ecuador'] },
            { code: 'ER', name: 'Érythrée', flag: 'https://flagcdn.com/w160/er.png', altNames: ['Erythree', 'Eritrea'] },
            { code: 'ES', name: 'Espagne', flag: 'https://flagcdn.com/w160/es.png', altNames: ['Spain'] },
            { code: 'EE', name: 'Estonie', flag: 'https://flagcdn.com/w160/ee.png', altNames: ['Estonia'] },
            { code: 'SZ', name: 'Eswatini', flag: 'https://flagcdn.com/w160/sz.png', altNames: ['Swaziland'] },
            { code: 'US', name: 'États-Unis', flag: 'https://flagcdn.com/w160/us.png', altNames: ['Etats-Unis', 'USA', 'United States'] },
            { code: 'ET', name: 'Éthiopie', flag: 'https://flagcdn.com/w160/et.png', altNames: ['Ethiopie', 'Ethiopia'] },
            { code: 'FJ', name: 'Fidji', flag: 'https://flagcdn.com/w160/fj.png', altNames: ['Fiji'] },
            { code: 'FI', name: 'Finlande', flag: 'https://flagcdn.com/w160/fi.png', altNames: ['Finland'] },
            { code: 'FR', name: 'France', flag: 'https://flagcdn.com/w160/fr.png', altNames: [] },
            { code: 'GA', name: 'Gabon', flag: 'https://flagcdn.com/w160/ga.png', altNames: [] },
            { code: 'GM', name: 'Gambie', flag: 'https://flagcdn.com/w160/gm.png', altNames: ['Gambia'] },
            { code: 'GE', name: 'Géorgie', flag: 'https://flagcdn.com/w160/ge.png', altNames: ['Georgie', 'Georgia'] },
            { code: 'GH', name: 'Ghana', flag: 'https://flagcdn.com/w160/gh.png', altNames: [] },
            { code: 'GR', name: 'Grèce', flag: 'https://flagcdn.com/w160/gr.png', altNames: ['Grece', 'Greece'] },
            { code: 'GD', name: 'Grenade', flag: 'https://flagcdn.com/w160/gd.png', altNames: ['Grenada'] },
            { code: 'GT', name: 'Guatemala', flag: 'https://flagcdn.com/w160/gt.png', altNames: [] },
            { code: 'GN', name: 'Guinée', flag: 'https://flagcdn.com/w160/gn.png', altNames: ['Guinee'] },
            { code: 'GW', name: 'Guinée-Bissau', flag: 'https://flagcdn.com/w160/gw.png', altNames: ['Guinee-Bissau', 'Guinea-Bissau'] },
            { code: 'GQ', name: 'Guinée équatoriale', flag: 'https://flagcdn.com/w160/gq.png', altNames: ['Guinee equatoriale', 'Equatorial Guinea'] },
            { code: 'GY', name: 'Guyana', flag: 'https://flagcdn.com/w160/gy.png', altNames: [] },
            { code: 'HT', name: 'Haïti', flag: 'https://flagcdn.com/w160/ht.png', altNames: ['Haiti'] },
            { code: 'HN', name: 'Honduras', flag: 'https://flagcdn.com/w160/hn.png', altNames: [] },
            { code: 'HU', name: 'Hongrie', flag: 'https://flagcdn.com/w160/hu.png', altNames: ['Hungary'] },
            { code: 'IN', name: 'Inde', flag: 'https://flagcdn.com/w160/in.png', altNames: ['India'] },
            { code: 'ID', name: 'Indonésie', flag: 'https://flagcdn.com/w160/id.png', altNames: ['Indonesie', 'Indonesia'] },
            { code: 'IQ', name: 'Irak', flag: 'https://flagcdn.com/w160/iq.png', altNames: ['Iraq'] },
            { code: 'IR', name: 'Iran', flag: 'https://flagcdn.com/w160/ir.png', altNames: [] },
            { code: 'IE', name: 'Irlande', flag: 'https://flagcdn.com/w160/ie.png', altNames: ['Ireland'] },
            { code: 'IS', name: 'Islande', flag: 'https://flagcdn.com/w160/is.png', altNames: ['Iceland'] },
            { code: 'IL', name: 'Israël', flag: 'https://flagcdn.com/w160/il.png', altNames: ['Israel'] },
            { code: 'IT', name: 'Italie', flag: 'https://flagcdn.com/w160/it.png', altNames: ['Italy'] },
            { code: 'JM', name: 'Jamaïque', flag: 'https://flagcdn.com/w160/jm.png', altNames: ['Jamaique', 'Jamaica'] },
            { code: 'JP', name: 'Japon', flag: 'https://flagcdn.com/w160/jp.png', altNames: ['Japan'] },
            { code: 'JO', name: 'Jordanie', flag: 'https://flagcdn.com/w160/jo.png', altNames: ['Jordan'] },
            { code: 'KZ', name: 'Kazakhstan', flag: 'https://flagcdn.com/w160/kz.png', altNames: [] },
            { code: 'KE', name: 'Kenya', flag: 'https://flagcdn.com/w160/ke.png', altNames: [] },
            { code: 'KG', name: 'Kirghizistan', flag: 'https://flagcdn.com/w160/kg.png', altNames: ['Kyrgyzstan'] },
            { code: 'KI', name: 'Kiribati', flag: 'https://flagcdn.com/w160/ki.png', altNames: [] },
            { code: 'KW', name: 'Koweït', flag: 'https://flagcdn.com/w160/kw.png', altNames: ['Koweit', 'Kuwait'] },
            { code: 'LA', name: 'Laos', flag: 'https://flagcdn.com/w160/la.png', altNames: [] },
            { code: 'LS', name: 'Lesotho', flag: 'https://flagcdn.com/w160/ls.png', altNames: [] },
            { code: 'LV', name: 'Lettonie', flag: 'https://flagcdn.com/w160/lv.png', altNames: ['Latvia'] },
            { code: 'LB', name: 'Liban', flag: 'https://flagcdn.com/w160/lb.png', altNames: ['Lebanon'] },
            { code: 'LR', name: 'Liberia', flag: 'https://flagcdn.com/w160/lr.png', altNames: [] },
            { code: 'LY', name: 'Libye', flag: 'https://flagcdn.com/w160/ly.png', altNames: ['Libya'] },
            { code: 'LI', name: 'Liechtenstein', flag: 'https://flagcdn.com/w160/li.png', altNames: [] },
            { code: 'LT', name: 'Lituanie', flag: 'https://flagcdn.com/w160/lt.png', altNames: ['Lithuania'] },
            { code: 'LU', name: 'Luxembourg', flag: 'https://flagcdn.com/w160/lu.png', altNames: [] },
            { code: 'MG', name: 'Madagascar', flag: 'https://flagcdn.com/w160/mg.png', altNames: [] },
            { code: 'MY', name: 'Malaisie', flag: 'https://flagcdn.com/w160/my.png', altNames: ['Malaysia'] },
            { code: 'MW', name: 'Malawi', flag: 'https://flagcdn.com/w160/mw.png', altNames: [] },
            { code: 'MV', name: 'Maldives', flag: 'https://flagcdn.com/w160/mv.png', altNames: [] },
            { code: 'ML', name: 'Mali', flag: 'https://flagcdn.com/w160/ml.png', altNames: [] },
            { code: 'MT', name: 'Malte', flag: 'https://flagcdn.com/w160/mt.png', altNames: ['Malta'] },
            { code: 'MH', name: 'Îles Marshall', flag: 'https://flagcdn.com/w160/mh.png', altNames: ['Iles Marshall', 'Marshall Islands'] },
            { code: 'MU', name: 'Maurice', flag: 'https://flagcdn.com/w160/mu.png', altNames: ['Mauritius'] },
            { code: 'MR', name: 'Mauritanie', flag: 'https://flagcdn.com/w160/mr.png', altNames: ['Mauritania'] },
            { code: 'MX', name: 'Mexique', flag: 'https://flagcdn.com/w160/mx.png', altNames: ['Mexique', 'Mexico'] },
            { code: 'FM', name: 'Micronésie', flag: 'https://flagcdn.com/w160/fm.png', altNames: ['Micronesie', 'Micronesia'] },
            { code: 'MD', name: 'Moldavie', flag: 'https://flagcdn.com/w160/md.png', altNames: ['Moldova'] },
            { code: 'MC', name: 'Monaco', flag: 'https://flagcdn.com/w160/mc.png', altNames: [] },
            { code: 'MN', name: 'Mongolie', flag: 'https://flagcdn.com/w160/mn.png', altNames: ['Mongolia'] },
            { code: 'ME', name: 'Monténégro', flag: 'https://flagcdn.com/w160/me.png', altNames: ['Montenegro'] },
            { code: 'MA', name: 'Maroc', flag: 'https://flagcdn.com/w160/ma.png', altNames: ['Morocco'] },
            { code: 'MZ', name: 'Mozambique', flag: 'https://flagcdn.com/w160/mz.png', altNames: [] },
            { code: 'NA', name: 'Namibie', flag: 'https://flagcdn.com/w160/na.png', altNames: ['Namibia'] },
            { code: 'NR', name: 'Nauru', flag: 'https://flagcdn.com/w160/nr.png', altNames: [] },
            { code: 'NP', name: 'Népal', flag: 'https://flagcdn.com/w160/np.png', altNames: ['Nepal'] },
            { code: 'NI', name: 'Nicaragua', flag: 'https://flagcdn.com/w160/ni.png', altNames: [] },
            { code: 'NE', name: 'Niger', flag: 'https://flagcdn.com/w160/ne.png', altNames: [] },
            { code: 'NG', name: 'Nigeria', flag: 'https://flagcdn.com/w160/ng.png', altNames: [] },
            { code: 'NO', name: 'Norvège', flag: 'https://flagcdn.com/w160/no.png', altNames: ['Norvege', 'Norway'] },
            { code: 'NZ', name: 'Nouvelle-Zélande', flag: 'https://flagcdn.com/w160/nz.png', altNames: ['Nouvelle Zelande', 'New Zealand'] },
            { code: 'OM', name: 'Oman', flag: 'https://flagcdn.com/w160/om.png', altNames: [] },
            { code: 'UG', name: 'Ouganda', flag: 'https://flagcdn.com/w160/ug.png', altNames: ['Uganda'] },
            { code: 'UZ', name: 'Ouzbékistan', flag: 'https://flagcdn.com/w160/uz.png', altNames: ['Ouzbekistan', 'Uzbekistan'] },
            { code: 'PK', name: 'Pakistan', flag: 'https://flagcdn.com/w160/pk.png', altNames: [] },
            { code: 'PW', name: 'Palaos', flag: 'https://flagcdn.com/w160/pw.png', altNames: ['Palau'] },
            { code: 'PA', name: 'Panama', flag: 'https://flagcdn.com/w160/pa.png', altNames: [] },
            { code: 'PG', name: 'Papouasie-Nouvelle-Guinée', flag: 'https://flagcdn.com/w160/pg.png', altNames: ['Papouasie Nouvelle Guinee', 'Papua New Guinea'] },
            { code: 'PY', name: 'Paraguay', flag: 'https://flagcdn.com/w160/py.png', altNames: [] },
            { code: 'NL', name: 'Pays-Bas', flag: 'https://flagcdn.com/w160/nl.png', altNames: ['Pays Bas', 'Netherlands'] },
            { code: 'PE', name: 'Pérou', flag: 'https://flagcdn.com/w160/pe.png', altNames: ['Perou', 'Peru'] },
            { code: 'PH', name: 'Philippines', flag: 'https://flagcdn.com/w160/ph.png', altNames: [] },
            { code: 'PL', name: 'Pologne', flag: 'https://flagcdn.com/w160/pl.png', altNames: ['Poland'] },
            { code: 'PT', name: 'Portugal', flag: 'https://flagcdn.com/w160/pt.png', altNames: [] },
            { code: 'QA', name: 'Qatar', flag: 'https://flagcdn.com/w160/qa.png', altNames: [] },
            { code: 'RO', name: 'Roumanie', flag: 'https://flagcdn.com/w160/ro.png', altNames: ['Romania'] },
            { code: 'GB', name: 'Royaume-Uni', flag: 'https://flagcdn.com/w160/gb.png', altNames: ['Royaume Uni', 'United Kingdom', 'UK'] },
            { code: 'RU', name: 'Russie', flag: 'https://flagcdn.com/w160/ru.png', altNames: ['Russia'] },
            { code: 'RW', name: 'Rwanda', flag: 'https://flagcdn.com/w160/rw.png', altNames: [] },
            { code: 'KN', name: 'Saint-Kitts-et-Nevis', flag: 'https://flagcdn.com/w160/kn.png', altNames: ['Saint Kitts et Nevis'] },
            { code: 'LC', name: 'Sainte-Lucie', flag: 'https://flagcdn.com/w160/lc.png', altNames: ['Sainte Lucie', 'Saint Lucia'] },
            { code: 'VC', name: 'Saint-Vincent-et-les-Grenadines', flag: 'https://flagcdn.com/w160/vc.png', altNames: ['Saint Vincent et les Grenadines'] },
            { code: 'SM', name: 'Saint-Marin', flag: 'https://flagcdn.com/w160/sm.png', altNames: ['Saint Marin', 'San Marino'] },
            { code: 'ST', name: 'São Tomé-et-Príncipe', flag: 'https://flagcdn.com/w160/st.png', altNames: ['Sao Tome et Principe'] },
            { code: 'SN', name: 'Sénégal', flag: 'https://flagcdn.com/w160/sn.png', altNames: ['Senegal'] },
            { code: 'RS', name: 'Serbie', flag: 'https://flagcdn.com/w160/rs.png', altNames: ['Serbia'] },
            { code: 'SC', name: 'Seychelles', flag: 'https://flagcdn.com/w160/sc.png', altNames: [] },
            { code: 'SL', name: 'Sierra Leone', flag: 'https://flagcdn.com/w160/sl.png', altNames: [] },
            { code: 'SG', name: 'Singapour', flag: 'https://flagcdn.com/w160/sg.png', altNames: ['Singapore'] },
            { code: 'SK', name: 'Slovaquie', flag: 'https://flagcdn.com/w160/sk.png', altNames: ['Slovakia'] },
            { code: 'SI', name: 'Slovénie', flag: 'https://flagcdn.com/w160/si.png', altNames: ['Slovenie', 'Slovenia'] },
            { code: 'SB', name: 'Îles Salomon', flag: 'https://flagcdn.com/w160/sb.png', altNames: ['Iles Salomon', 'Solomon Islands'] },
            { code: 'SO', name: 'Somalie', flag: 'https://flagcdn.com/w160/so.png', altNames: ['Somalia'] },
            { code: 'SD', name: 'Soudan', flag: 'https://flagcdn.com/w160/sd.png', altNames: ['Sudan'] },
            { code: 'SS', name: 'Soudan du Sud', flag: 'https://flagcdn.com/w160/ss.png', altNames: ['South Sudan'] },
            { code: 'LK', name: 'Sri Lanka', flag: 'https://flagcdn.com/w160/lk.png', altNames: [] },
            { code: 'SE', name: 'Suède', flag: 'https://flagcdn.com/w160/se.png', altNames: ['Suede', 'Sweden'] },
            { code: 'CH', name: 'Suisse', flag: 'https://flagcdn.com/w160/ch.png', altNames: ['Switzerland'] },
            { code: 'SR', name: 'Suriname', flag: 'https://flagcdn.com/w160/sr.png', altNames: [] },
            { code: 'SY', name: 'Syrie', flag: 'https://flagcdn.com/w160/sy.png', altNames: ['Syria'] },
            { code: 'TJ', name: 'Tadjikistan', flag: 'https://flagcdn.com/w160/tj.png', altNames: ['Tajikistan'] },
            { code: 'TZ', name: 'Tanzanie', flag: 'https://flagcdn.com/w160/tz.png', altNames: ['Tanzania'] },
            { code: 'TH', name: 'Thaïlande', flag: 'https://flagcdn.com/w160/th.png', altNames: ['Thailande', 'Thailand'] },
            { code: 'TL', name: 'Timor oriental', flag: 'https://flagcdn.com/w160/tl.png', altNames: ['Timor Oriental', 'East Timor'] },
            { code: 'TG', name: 'Togo', flag: 'https://flagcdn.com/w160/tg.png', altNames: [] },
            { code: 'TO', name: 'Tonga', flag: 'https://flagcdn.com/w160/to.png', altNames: [] },
            { code: 'TT', name: 'Trinité-et-Tobago', flag: 'https://flagcdn.com/w160/tt.png', altNames: ['Trinite et Tobago', 'Trinidad and Tobago'] },
            { code: 'TN', name: 'Tunisie', flag: 'https://flagcdn.com/w160/tn.png', altNames: ['Tunisia'] },
            { code: 'TM', name: 'Turkménistan', flag: 'https://flagcdn.com/w160/tm.png', altNames: ['Turkmenistan'] },
            { code: 'TR', name: 'Turquie', flag: 'https://flagcdn.com/w160/tr.png', altNames: ['Turkey'] },
            { code: 'TV', name: 'Tuvalu', flag: 'https://flagcdn.com/w160/tv.png', altNames: [] },
            { code: 'UA', name: 'Ukraine', flag: 'https://flagcdn.com/w160/ua.png', altNames: [] },
            { code: 'UY', name: 'Uruguay', flag: 'https://flagcdn.com/w160/uy.png', altNames: [] },
            { code: 'VU', name: 'Vanuatu', flag: 'https://flagcdn.com/w160/vu.png', altNames: [] },
            { code: 'VA', name: 'Vatican', flag: 'https://flagcdn.com/w160/va.png', altNames: ['Vatican City'] },
            { code: 'VE', name: 'Venezuela', flag: 'https://flagcdn.com/w160/ve.png', altNames: [] },
            { code: 'VN', name: 'Viêt Nam', flag: 'https://flagcdn.com/w160/vn.png', altNames: ['Viet Nam', 'Vietnam'] },
            { code: 'YE', name: 'Yémen', flag: 'https://flagcdn.com/w160/ye.png', altNames: ['Yemen'] },
            { code: 'ZM', name: 'Zambie', flag: 'https://flagcdn.com/w160/zm.png', altNames: ['Zambia'] },
            { code: 'ZW', name: 'Zimbabwe', flag: 'https://flagcdn.com/w160/zw.png', altNames: [] }
        ];
    }

    /**
     * Mélange un tableau de manière aléatoire (algorithme Fisher-Yates)
     * @param {Array} array - Tableau à mélanger
     * @returns {Array} Tableau mélangé
     */
    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    /**
     * Initialise le jeu
     */
    init() {
        this.loadState();
        
        // Mélanger l'ordre des pays si ce n'est pas déjà fait
        if (this.countriesOrder.length === 0) {
            this.countriesOrder = this.shuffleArray(this.countries.map(c => c.code));
        }
    }

    /**
     * Démarre ou reprend le jeu
     */
    start() {
        this.isActive = true;
        this.isPaused = false;
        this.render();
    }

    /**
     * Récupère les pays dans l'ordre mélangé
     * @returns {Array} Liste des pays dans l'ordre aléatoire
     */
    getCountriesInOrder() {
        return this.countriesOrder.map(code => 
            this.countries.find(c => c.code === code)
        ).filter(c => c !== undefined);
    }

    /**
     * Utilise un indice pour révéler une lettre d'un pays
     * @param {string} countryCode - Code du pays
     */
    useHint(countryCode) {
        const country = this.countries.find(c => c.code === countryCode);
        if (!country || this.foundCountries.includes(countryCode)) {
            return;
        }

        // Vérifier si on a assez de points
        if (!gameManager.spendPoints(25)) {
            this.showFeedback('❌ Pas assez de points pour utiliser un indice !', 'error', 2000);
            return;
        }

        // Initialiser la liste des indices si nécessaire
        if (!this.hintsRevealed[countryCode]) {
            this.hintsRevealed[countryCode] = [];
        }

        // Trouver une lettre non encore révélée
        const name = country.name;
        const allIndices = Array.from({ length: name.length }, (_, i) => i);
        const availableIndices = allIndices.filter(i => 
            !this.hintsRevealed[countryCode].includes(i) && name[i] !== ' '
        );

        if (availableIndices.length > 0) {
            // Révéler une lettre aléatoire parmi celles disponibles
            const randomIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
            this.hintsRevealed[countryCode].push(randomIndex);
            this.saveState();
            this.render();
            this.showFeedback(`💡 Lettre révélée : "${name[randomIndex]}" (-25 pts)`, 'success', 2000);
        } else {
            // Toutes les lettres sont déjà révélées
            this.showFeedback('💡 Toutes les lettres sont déjà révélées !', 'error', 2000);
            // Rembourser les points
            gameManager.addPoints(15);
        }
    }

    /**
     * Génère le placeholder avec les lettres révélées
     * @param {Object} country - Objet pays
     * @returns {string} Placeholder avec lettres révélées
     */
    getHintPlaceholder(country) {
        if (!this.hintsRevealed[country.code] || this.hintsRevealed[country.code].length === 0) {
            return 'Nom du pays...';
        }

        const name = country.name;
        const revealed = this.hintsRevealed[country.code];
        let placeholder = '';

        for (let i = 0; i < name.length; i++) {
            if (revealed.includes(i)) {
                placeholder += name[i];
            } else if (name[i] === ' ') {
                placeholder += ' ';
            } else {
                placeholder += '_';
            }
        }

        return placeholder;
    }

    /**
     * Normalise une chaîne pour la comparaison (minuscules, suppression accents)
     * @param {string} str - Chaîne à normaliser
     * @returns {string} Chaîne normalisée
     */
    normalizeString(str) {
        return str
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '') // Supprime les accents
            .replace(/[^a-z0-9\s]/g, '') // Supprime la ponctuation
            .trim()
            .replace(/\s+/g, ' '); // Normalise les espaces
    }

    /**
     * Calcule la distance de Levenshtein entre deux chaînes
     * @param {string} str1 - Première chaîne
     * @param {string} str2 - Deuxième chaîne
     * @returns {number} Distance de Levenshtein
     */
    levenshteinDistance(str1, str2) {
        const matrix = [];
        const len1 = str1.length;
        const len2 = str2.length;

        for (let i = 0; i <= len1; i++) {
            matrix[i] = [i];
        }

        for (let j = 0; j <= len2; j++) {
            matrix[0][j] = j;
        }

        for (let i = 1; i <= len1; i++) {
            for (let j = 1; j <= len2; j++) {
                if (str1[i - 1] === str2[j - 1]) {
                    matrix[i][j] = matrix[i - 1][j - 1];
                } else {
                    matrix[i][j] = Math.min(
                        matrix[i - 1][j] + 1,
                        matrix[i][j - 1] + 1,
                        matrix[i - 1][j - 1] + 1
                    );
                }
            }
        }

        return matrix[len1][len2];
    }

    /**
     * Vérifie si une réponse correspond à un pays avec tolérance orthographique
     * @param {string} userInput - Réponse de l'utilisateur
     * @param {Object} country - Objet pays
     * @returns {boolean} true si la réponse est correcte
     */
    checkAnswer(userInput, country) {
        if (!userInput || !userInput.trim()) return false;

        const normalizedInput = this.normalizeString(userInput);
        const normalizedName = this.normalizeString(country.name);

        // Vérification exacte (après normalisation)
        if (normalizedInput === normalizedName) return true;

        // Vérification des noms alternatifs
        for (const altName of country.altNames || []) {
            if (this.normalizeString(altName) === normalizedInput) return true;
        }

        // Tolérance orthographique avec distance de Levenshtein
        const maxDistance = Math.max(2, Math.floor(normalizedName.length * 0.15)); // 15% de tolérance
        const distance = this.levenshteinDistance(normalizedInput, normalizedName);

        if (distance <= maxDistance) return true;

        // Vérifier aussi avec les noms alternatifs
        for (const altName of country.altNames || []) {
            const normalizedAlt = this.normalizeString(altName);
            const altDistance = this.levenshteinDistance(normalizedInput, normalizedAlt);
            if (altDistance <= maxDistance) return true;
        }

        return false;
    }

    /**
     * Gère la soumission d'une réponse pour un pays
     * @param {string} countryCode - Code du pays
     * @param {string} userInput - Réponse de l'utilisateur
     */
    handleAnswer(countryCode, userInput) {
        const country = this.countries.find(c => c.code === countryCode);
        if (!country) return;

        // Si déjà trouvé, ne rien faire
        if (this.foundCountries.includes(countryCode)) return;

        // Sauvegarder la réponse de l'utilisateur
        this.userAnswers[countryCode] = userInput;

        // Vérifier si la réponse est correcte
        if (this.checkAnswer(userInput, country)) {
            this.foundCountries.push(countryCode);
            gameManager.addPoints(10);
            this.saveState();
            this.render();
            
            // Vérifier si tous les pays sont trouvés
            if (this.foundCountries.length === this.countries.length) {
                this.showFeedback('🎉 Félicitations ! Vous avez trouvé tous les drapeaux !', 'success', 5000);
            }
        }
    }

    /**
     * Rend l'interface du jeu
     */
    render() {
        const container = this.getGameContainer();
        const stats = this.foundCountries.length;
        const total = this.countries.length;
        const percentage = Math.round((stats / total) * 100);
        const countriesInOrder = this.getCountriesInOrder();

        // Sauvegarder la position de scroll avant de réinitialiser le DOM
        const flagsContainer = container.querySelector('.flags-grid-container');
        let savedScrollTop = 0;
        let savedVisibleElement = null;
        
        if (flagsContainer) {
            savedScrollTop = flagsContainer.scrollTop;
            // Trouver le premier élément visible dans le viewport pour une restauration plus précise
            const flagItems = flagsContainer.querySelectorAll('.flag-item');
            const containerRect = flagsContainer.getBoundingClientRect();
            for (const item of flagItems) {
                const itemRect = item.getBoundingClientRect();
                if (itemRect.top >= containerRect.top && itemRect.top <= containerRect.bottom) {
                    savedVisibleElement = item.getAttribute('data-code');
                    break;
                }
            }
        }

        container.innerHTML = `
            <div class="game-header">
                <div style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
                    <div>
                        <h2>${this.name}</h2>
                        <p>Progression: ${stats}/${total} (${percentage}%)</p>
                    </div>
                    <button class="btn-restart" onclick="flagGame.reset()" title="Réinitialiser le jeu">🔄 Restart</button>
                </div>
            </div>

            <div class="flags-grid-container">
                <div class="flags-grid" id="flags-grid">
                    ${countriesInOrder.map(country => {
                        const isFound = this.foundCountries.includes(country.code);
                        const userAnswer = this.userAnswers[country.code] || '';
                        const hasHint = this.hintsRevealed[country.code] && this.hintsRevealed[country.code].length > 0;
                        const placeholder = isFound ? country.name : (hasHint ? this.getHintPlaceholder(country) : 'Nom du pays...');
                        
                        return `
                            <div class="flag-item ${isFound ? 'found' : ''}" data-code="${country.code}">
                                <div class="flag-image-small">
                                    <img src="${country.flag}" alt="${country.name}" onerror="this.parentElement.innerHTML='❓'">
                                    ${isFound ? '<div class="checkmark">✓</div>' : ''}
                                </div>
                                <input 
                                    type="text" 
                                    class="flag-input ${isFound ? 'correct' : ''}"
                                    placeholder="${placeholder}"
                                    value="${isFound ? country.name : userAnswer}"
                                    data-code="${country.code}"
                                    ${isFound ? 'disabled' : ''}
                                    autocomplete="off"
                                />
                                ${!isFound ? `
                                    <button 
                                        class="btn-hint" 
                                        data-code="${country.code}"
                                        title="Révéler une lettre (-25 pts)"
                                    >
                                        💡
                                    </button>
                                ` : ''}
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>

            <div class="game-stats">
                <p>Score actuel: ${gameManager.getGlobalScore()} pts</p>
            </div>
        `;

        // Attacher les event listeners
        this.attachEventListeners();

        // Restaurer la position de scroll après le rendu
        if (savedScrollTop > 0 || savedVisibleElement) {
            const restoreScroll = () => {
                const newFlagsContainer = container.querySelector('.flags-grid-container');
                if (!newFlagsContainer) return;
                
                // Essayer d'abord de restaurer via l'élément visible (plus fiable)
                if (savedVisibleElement) {
                    const targetElement = newFlagsContainer.querySelector(`[data-code="${savedVisibleElement}"]`);
                    if (targetElement) {
                        targetElement.scrollIntoView({ behavior: 'instant', block: 'start' });
                        // Ajuster légèrement pour compenser le padding
                        newFlagsContainer.scrollTop = Math.max(0, newFlagsContainer.scrollTop - 10);
                        return;
                    }
                }
                
                // Fallback : restaurer la position en pixels
                newFlagsContainer.scrollTop = savedScrollTop;
            };
            
            // Essayer plusieurs fois pour gérer le chargement asynchrone des images
            requestAnimationFrame(() => {
                restoreScroll();
                requestAnimationFrame(() => {
                    restoreScroll();
                    // Une dernière tentative après un court délai pour les images lentes
                    setTimeout(restoreScroll, 100);
                });
            });
        }
    }

    /**
     * Attache les event listeners
     */
    attachEventListeners() {
        const inputs = document.querySelectorAll('.flag-input:not(:disabled)');
        
        inputs.forEach(input => {
            const countryCode = input.getAttribute('data-code');
            
            // Validation à la perte de focus ou Enter
            input.addEventListener('blur', () => {
                this.handleAnswer(countryCode, input.value);
            });

            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    input.blur();
                }
            });
        });

        // Boutons d'indice
        const hintButtons = document.querySelectorAll('.btn-hint');
        hintButtons.forEach(button => {
            button.addEventListener('click', () => {
                const countryCode = button.getAttribute('data-code');
                this.useHint(countryCode);
            });
        });
    }

    /**
     * Sauvegarde l'état du jeu
     */
    saveState() {
        const state = {
            foundCountries: this.foundCountries,
            userAnswers: this.userAnswers,
            hintsRevealed: this.hintsRevealed,
            countriesOrder: this.countriesOrder
        };
        StorageManager.saveGameState(this.gameId, state);
    }

    /**
     * Charge l'état sauvegardé du jeu
     */
    loadState() {
        const state = StorageManager.loadGameState(this.gameId);
        if (state) {
            this.foundCountries = state.foundCountries || [];
            this.userAnswers = state.userAnswers || {};
            this.hintsRevealed = state.hintsRevealed || {};
            this.countriesOrder = state.countriesOrder || [];
        }
        
        // Si pas d'ordre sauvegardé, créer un ordre aléatoire
        if (this.countriesOrder.length === 0) {
            this.countriesOrder = this.shuffleArray(this.countries.map(c => c.code));
            this.saveState();
        }
    }

    /**
     * Retourne la progression du jeu
     * @returns {Object} { found: number, total: number, percentage: number }
     */
    getProgress() {
        const found = this.foundCountries.length;
        const total = this.countries.length;
        const percentage = total > 0 ? Math.round((found / total) * 100) : 0;
        return { found, total, percentage };
    }

    /**
     * Réinitialise le jeu
     */
    reset() {
        super.reset();
        this.foundCountries = [];
        this.userAnswers = {};
        this.hintsRevealed = {};
        this.countriesOrder = this.shuffleArray(this.countries.map(c => c.code));
    }
}
