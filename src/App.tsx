import './index.css'
import React, { useEffect } from 'react';
import { calculations } from './yang';
import { useRef } from "react";
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
//import { Separator } from "@/components/ui/separator"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from "@/components/ui/select"
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

const schema = z.object({
  output: z.number().default(0),
  fluxo_valvula: z.number().default(0),
  fluxo_valvula_unidade: z.string().default("m3s"),
  fluxo_valvula_convertido: z.number().default(0),
  altura_valvula: z.number().default(0),
  eficiencia_estimada: z.number().default(0.7),
  coeficiente_vazao: z.number().default(0),
  coeficiente_altura: z.number().default(0),
  fluxo_bomba_m3s: z.number().default(0),
  fluxo_bomba_m3h: z.number().default(0),
  altura_bomba: z.number().default(0),
  rotacao_rpm: z.number().default(0),
  rotacao_rps: z.number().default(0),
  diametro_bomba: z.number().default(0.123),
  potencia: z.number().default(0),
  velocidade_especifica_rps: z.number().default(0),
  velocidade_especifica_rad: z.number().default(0),
});
type FormData = z.infer<typeof schema>;

export function App() {
  const {
    control,
    setValue,
    watch,
  } = useForm<FormData>();
  const formValues = watch();

  useEffect(() => {
    Object.entries(calculations).forEach(([output, func]) => {
      setValue(output as keyof FormData, parseFloat(func(formValues).toFixed(2)));
    });
  }, [formValues, setValue]);

  return (
    <div className='flex items-center justify-center a h-screen w-full bg-zinc-100'>
      <div className='flex justify-center items-center p-8 w-4/4 sm:w-1/2 lg bg-white'>
        <form>
          <Tabs defaultValue="bomba" className="">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="bomba">Bomba</TabsTrigger>
              <TabsTrigger value="turbina">Turbina</TabsTrigger>
            </TabsList>
            <TabsContent value="bomba">
              <Card>
                <CardHeader>
                  <CardTitle>Aproveitamento da Valvula</CardTitle>
                  <CardDescription>
                    Make changes to your account here. Click save when you're done.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg gap-4'>
                  <div className='flex items-end gap-1'>
                    <div>
                      <Label htmlFor="fluxo_valvula" className='w-full'>Fluxo da Valvula - Qti</Label>
                      <Controller
                        name="fluxo_valvula"
                        control={control}
                        render={({ field }) => (
                          <Input type="text" {...field} />
                        )}
                      />
                    </div>
                    <div>
                      <Controller
                        name="fluxo_valvula_unidade"
                        control={control}
                        render={({ field }) => (
                          <Select {...field}>
                            <SelectTrigger className="w-[75px]">
                              <SelectValue placeholder="unid." />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="m3s">m³/s</SelectItem>
                              <SelectItem value="m3h">m³/h</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="fluxo_valvula_convertido" className="block text-sm">
                      Fluxo da Valvula - Qti
                    </Label>
                    <Controller
                      name="fluxo_valvula_convertido"
                      control={control}
                      render={({ field }) => (
                        <Input disabled {...field} />
                      )}
                    />
                  </div>

                  <div>
                    <Label htmlFor="altura_valvula">Altura da Valvula - Hti (m)</Label>
                    <Controller
                      name="altura_valvula"
                      control={control}
                      render={({ field }) => (
                        <Input type="text" {...field} />
                      )}
                    />
                  </div>

                  <div>
                    <Label htmlFor="eficiencia_estimada" className="block text-sm">
                      Eficiência estimada (η<sub>b</sub>)
                    </Label>
                    <Controller
                      name="eficiencia_estimada"
                      control={control}
                      render={({ field }) => (
                        <Input type="text" placeholder="0.7" {...field} />
                      )}
                    />
                  </div>

                  <div>
                    <Label htmlFor="coeficiente_vazao" className="block text-sm">
                      Coeficiente de vazão (q)
                    </Label>
                    <Controller
                      name="coeficiente_vazao"
                      control={control}
                      render={({ field }) => (
                        <Input disabled placeholder="0.00" {...field} />
                      )}
                    />
                  </div>

                  <div>
                    <Label htmlFor="coeficiente_altura" className="block text-sm">
                      Coeficiente de altura (h)
                    </Label>
                    <Controller
                      name="coeficiente_altura"
                      control={control}
                      render={({ field }) => (
                        <Input disabled placeholder="0.00" {...field} />
                      )}
                    />
                  </div>

                  <div>
                    <Label htmlFor="fluxo_bomba_m3s" className="block text-sm">
                      Fluxo - Qb (m³/s)
                    </Label>
                    <Controller
                      name="fluxo_bomba_m3s"
                      control={control}
                      render={({ field }) => (
                        <Input disabled placeholder="0.00" {...field} />
                      )}
                    />
                  </div>

                  <div>
                    <Label htmlFor="fluxo_bomba_m3h" className="block text-sm">
                      Fluxo - Qb (m³/h)
                    </Label>
                    <Controller
                      name="fluxo_bomba_m3h"
                      control={control}
                      render={({ field }) => (
                        <Input disabled placeholder="0.00" {...field} />
                      )}
                    />
                  </div>

                  <div>
                    <Label htmlFor="altura_bomba" className="block text-sm">
                      Altura - Hb (m)
                    </Label>
                    <Controller
                      name="altura_bomba"
                      control={control}
                      render={({ field }) => (
                        <Input disabled placeholder="0.00" {...field} />
                      )}
                    />
                  </div>

                  <div>
                    <Label htmlFor="rotacao_rpm" className="block text-sm">
                      Rotação - N (rpm)
                    </Label>
                    <Controller
                      name="rotacao_rpm"
                      control={control}
                      render={({ field }) => (
                        <Input type="text" placeholder="0000" {...field} />
                      )}
                    />
                  </div>

                  <div>
                    <Label htmlFor="rotacao_rps" className="block text-sm">
                      Rotação - N (rps)
                    </Label>
                    <Controller
                      name="rotacao_rps"
                      control={control}
                      render={({ field }) => (
                        <Input disabled placeholder="0000" {...field} />
                      )}
                    />
                  </div>

                  <div>
                    <Label htmlFor="diametro_bomba" className="block text-sm">
                      Diâmetro - D (m)
                    </Label>
                    <Controller
                      name="diametro_bomba"
                      control={control}
                      render={({ field }) => (
                        <Input type="text" placeholder="0.123" {...field} />
                      )}
                    />
                  </div>

                  <div>
                    <Label htmlFor="potencia" className="block text-sm">
                      Potência - P (kWh)
                    </Label>
                    <Controller
                      name="potencia"
                      control={control}
                      render={({ field }) => (
                        <Input disabled placeholder="00" {...field} />
                      )}
                    />
                  </div>

                  <div>
                    <Label htmlFor="velocidade_especifica_rps" className="block text-sm">
                      Velocidade específica - Ns (rps)
                    </Label>
                    <Controller
                      name="velocidade_especifica_rps"
                      control={control}
                      render={({ field }) => (
                        <Input disabled placeholder="0000" {...field} />
                      )}
                    />
                  </div>

                  <div>
                    <Label htmlFor="velocidade_especifica_rad" className="block text-sm">
                      Velocidade específica - Ns (rad/s)
                    </Label>
                    <Controller
                      name="velocidade_especifica_rad"
                      control={control}
                      render={({ field }) => (
                        <Input disabled placeholder="0" {...field} />
                      )}
                    />
                  </div>
                </div>
                    
                </CardContent>
                <CardFooter>
                  <Button type='submit'>Save changes</Button>
                </CardFooter>
              </Card>
            </TabsContent>
            <TabsContent value="turbina">
              <Card>
                <CardHeader>
                  <CardTitle>Turbina</CardTitle>
                  <CardDescription>
                    Change your password here. After saving, you'll be logged out.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                
                </CardContent>
                <CardFooter>
                  <Button>Save password</Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </form>
      </div>
    </div>
  )
}
