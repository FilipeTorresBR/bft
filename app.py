import math
import matplotlib

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
ns_rps = (n_rps * qb_m3s**0.5)/(9.81*hb)**0.75
ns_rad = 2*math.pi*ns_rps

###YANG - 2
y2_nb = 0.670
y2_q = ((1.2)/y2_nb**0.55)
y2_h = ((1.2)/y2_nb**1.1)
qt_m3s = qb_m3s*y2_q
qt_m3h = qt_m3s * 3600
ht_m = hb * y2_h
fi_bept = ((qt_m3s) / ((n_rps)*(d**3)))
psi_bept = (9.81*ht_m) / ((n_rps * d)**2)
fi_t = []
psi_t = []
eta_t = []
qt_ls = []
fi_t.append(fi_bept)

for x in range(1, 40):
    psi_t.insert(0, psi_bept*(0.2394*(fi_t[0]/fi_bept)**2 + 0.769*(fi_t[0]/fi_bept)))
    eta_t.insert(0, ((-1.9788*((fi_t[0]/fi_bept)**6))+(9.0636*((fi_t[0]/fi_bept)**5))-(13.148*((fi_t[0]/fi_bept)**4))+(3.8527*((fi_t[0]/fi_bept)**3))+(4.5614*((fi_t[0]/fi_bept)**2))-(1.3769*((fi_t[0]/fi_bept))))*(nb))
    qt_ls.insert(0, ((fi_t[0])*((n_rps)*(d**3)))*1000)
    fi_t.insert(0, fi_t[x - 1] - (0.003 * x))
print (len(psi_t))             
for x in range(40, 58):
    psi_t.append(psi_bept*(0.2394*(fi_t[x-1]/fi_bept)**2 + 0.769*(fi_t[x-1]/fi_bept)))
    eta_t.append(((-1.9788*((fi_t[x-1]/fi_bept)**6))+(9.0636*((fi_t[x-1]/fi_bept)**5))-(13.148*((fi_t[x-1]/fi_bept)**4))+(3.8527*((fi_t[x-1]/fi_bept)**3))+(4.5614*((fi_t[x-1]/fi_bept)**2))-(1.3769*((fi_t[x-1]/fi_bept))))*(nb))
    qt_ls.append(((fi_t[x-1])*((n_rps)*(d**3)))*1000)
    fi_t.append(fi_t[x - 1] + 0.003)

print("----------------------------------------")
for x in range(0, 57):
    print(x, psi_t[x])
#print(psi_t)