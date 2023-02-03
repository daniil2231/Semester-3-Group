int IRA = 6; // connect ir sensor to arduino pin 2
int IRB = 8; // connect ir sensor to arduino pin 4
String buffer;
String bufferA;
String bufferB;

int prev_A = 0;
int prev_B = 0;

void setup() 
{

  pinMode (IRA, INPUT); // sensor pin INPUT
  pinMode (IRB, INPUT); // sensor pin INPUT
  Serial.begin(9600);
 
}

void send_to_backend()
{
  //sent A and B to back
  Serial.println("SEND TO BACKEND!STATE CHANGED!");
}

int check(int a, int b)
{
    int ok = 0;
    if(a != prev_A)
    {
      ok = 1;
    }
    if(b != prev_B)
    {
      ok = 1;
    }
    if(ok == 1)
    {
      send_to_backend();      
    }    
}

void loop()
{

  int statusSensorA = digitalRead (IRA);
  int statusSensorB = digitalRead (IRB);
  

  int A, B;

  if(statusSensorA == 1)
  {
    A = 1;
  }
  else
  {
    A = 0;
  }

  if(statusSensorB == 1)
   {
     B = 1;
   }
   else
   {
     B = 0;
   }


    
    buffer = String(A) + String(B);
bufferA = String(A);
bufferB = String(B);
 
  
// int old_A;
// int old_B;


 if(A != prev_A || B!= prev_B ){
  Serial.println(String(statusSensorB)+String(statusSensorA));
   prev_A = A;
   prev_B = B;
  delay(2000);
  } 
  
  
  

}