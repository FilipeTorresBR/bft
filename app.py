import math
from matplotlib import pyplot as plt
import eel

eel.init('web')
@eel.expose
def auto_calculate(value, name):
    if name == "y1_nib":
        y1_q = ((1.2)/value**0.55)
        y1_h = ((1.2)/value**1.1)
        return {"y1_q":y1_q, "y1_h":y1_h}


eel.start('main.html', mode='default')


####YANG - 1
y1_nib = 0.70
y1_q = ((1.2)/y1_nib**0.55)
y1_h = ((1.2)/y1_nib**1.1)
qti = 0.0198 #m3/s
hti = 39.89 #39.89 é a media que deve ser calculada da planilha PRV 3.3 celula Y36
qb_m3s = qti / y1_q  #m3/s
qb_m3h = qb_m3s * 3600
hb = hti / y1_h
n_rpm = 3500
n_rps = n_rpm / 60
d = 0.123
nb = 0.670
p_kw = 16.50
y1_ns_rps = (n_rps * qb_m3s**0.5)/(9.81*hb)**0.75
y1_ns_rad = 2*math.pi*y1_ns_rps

###YANG - 2
y2_nb = 0.670
y2_q = ((1.2)/y2_nb**0.55)
y2_h = ((1.2)/y2_nb**1.1)
qt_m3s = qb_m3s*y2_q
qt_m3h = qt_m3s * 3600
ht_m = hb * y2_h
fi_bept = ((qt_m3s) / ((n_rps)*(d**3)))
psi_bept = (9.81*ht_m) / ((n_rps * d)**2)
y2_ns_rps = (n_rps * qt_m3s**0.5)/(9.81*hb)**0.75
y2_ns_rad = 2*math.pi*y2_ns_rps
fi_t = []
psi_t = []
eta_t = []
qt_ls = []
h_m = []
fi_t.append(fi_bept)
for x in range(1, 40):
    fi_t.insert(0, fi_t[x - 1] - (0.003 * x))

for x in range(40, 60):
    fi_t.append(fi_t[x - 1] + 0.003)

for x in range(0, len(fi_t)):
    psi_t.append(psi_bept*(0.2394*(fi_t[x]/fi_bept)**2 + 0.769*(fi_t[x]/fi_bept)))
    eta_t.append(((-1.9788*((fi_t[x]/fi_bept)**6))+(9.0636*((fi_t[x]/fi_bept)**5))-(13.148*((fi_t[x]/fi_bept)**4))+(3.8527*((fi_t[x]/fi_bept)**3))+(4.5614*((fi_t[x]/fi_bept)**2))-(1.3769*((fi_t[x]/fi_bept))))*(nb))
    qt_ls.append((((fi_t[x])*((n_rps)*(d**3)))*1000)/3.6)
    h_m.append((psi_t[x]*(n_rps * d)**2) / 9.81)
#print("----------------------------------------")
#for x in range(0, len(fi_t)):
    #print(x, fi_t[x],  "|", qt_ls[x])

figure, axis = plt.subplots(2, 2) 

axis[0, 0].plot(fi_t, psi_t)
axis[0, 0].set_title("fi/psi") 

axis[0, 1].plot(fi_t, eta_t)
axis[0, 1].set_title("fi/eta") 

axis[1, 0].plot(qt_ls, h_m)
axis[1, 0].set_title("qt/h") 

axis[1, 1].plot(qt_ls, eta_t)
axis[1, 1].set_title("qt/eta") 


#plt.show()
